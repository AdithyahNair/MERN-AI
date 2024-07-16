const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//* Stripe Payment

const handleStripPayment = asyncHandler(async (req, res) => {
  const { amount, subscriptionPlan } = req.body;

  //* get user

  const user = req?.user;
  console.log(user);
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

    console.log(paymentIntent);

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

module.exports = handleStripPayment;
