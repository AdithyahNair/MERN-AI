const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const {
  calculateNextBillingDate,
  shouldRenewSubscriptionPlan,
} = require("../utils/billingCalculations");
const Payment = require("../models/Payment");
const User = require("../models/User");

//* Stripe Payment

const handleStripPayment = asyncHandler(async (req, res) => {
  const { amount, subscriptionPlan } = req.body;

  //* get user

  const user = req?.user;
  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100 /** 100 cents */,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      //* adding meta data
      metadata: {
        userId: user?._id?.toString(),
        userEmail: user?.email,
        subscriptionPlan,
      },
    });

    res.send({
      clientSecret: paymentIntent?.client_secret,
      paymentId: paymentIntent?.id,
      metadata: paymentIntent?.metadata,
    });
  } catch (error) {
    console.log(`Stripe payment error: ${error}`);
    res.status(500).json({
      message: error,
    });
  }
});

//* Handle free subscription

const handleFreeSubscription = asyncHandler(async (req, res) => {
  const user = req?.user;

  try {
    if (shouldRenewSubscriptionPlan(user)) {
      //* Update user

      (user.subscriptionPlan = "Free"), (user.monthlyRequestCount = 5);
      user.apiRequestCount = 0;
      //* Calculate next Billing Date
      user.nextBillingDate = calculateNextBillingDate();

      //* Create new payment

      const payment = await Payment.create({
        user: user?._id,
        subscription: "Free",
        status: "success",
        amount: 0,
        reference: Math.random().toString(36).substring(7),
        monthlyRequestCount: 5,
        currency: "usd",
      });

      user.payments.push(payment?._id);
      await user.save();
      return res.status(200).json({
        message: "Subscription Plan Updated Successfully!",
      });
    } else {
      return res.status(403).json({
        error: "Subscription Renewal Not Due Yet",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//* Verify Payment

const verifyPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
    console.log(paymentIntent);

    if (paymentIntent.status !== "succeeded") {
      const metadata = paymentIntent.metadata;
      const { userId, userEmail, subscriptionPlan } = metadata;

      const userFound = await User.findById(userId);

      if (!userFound) {
        return res.status(404).json({
          message: "user not found!",
        });
      }

      //* get the payment details
      const amount = paymentIntent.amount / 100;
      const currency = paymentIntent.currency;
      const paymentId = paymentIntent.id;

      //* Create payment model

      const newPayment = await Payment.create({
        user: userId,
        email: userEmail,
        subscription: subscriptionPlan,
        amount,
        currency,
        status: "success",
        reference: paymentId,
      });

      if (subscriptionPlan === "Basic") {
        //* Update user

        const updatedUser = await User.findByIdAndUpdate(userId, {
          subscriptionPlan: "Basic",
          apiRequestCount: 0,
          monthlyRequestCount: 50,
          nextBillingDate: calculateNextBillingDate(),
          trialPeriod: 0,
          $addToSet: { payments: newPayment._id },
        }).select("-password");

        await updatedUser.save();

        res.status(200).json({
          message: "Payment verified, user updated to Basic Plan",
          updatedUser,
        });
      }

      if (subscriptionPlan === "Premium") {
        //* Update user

        const updatedUser = await User.findByIdAndUpdate(userId, {
          subscriptionPlan: "Premium",
          apiRequestCount: 0,
          monthlyRequestCount: 100,
          nextBillingDate: calculateNextBillingDate(),
          trialPeriod: 0,
          $addToSet: { payments: newPayment._id },
        }).select("-password");

        res.status(200).json({
          message: "Payment verified, user updated to Premium Plan",
          updatedUser,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});
module.exports = { handleStripPayment, handleFreeSubscription, verifyPayment };
