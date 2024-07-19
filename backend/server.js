const express = require("express");
const userRouter = require("./routes/userRouter");
const cookieParser = require("cookie-parser");
var cron = require("node-cron");
require("dotenv").config();
const errorHandler = require("./middlewares/errorMiddleware");
const geminiAIRouter = require("./routes/geminiAIRouter");
const stripeRouter = require("./routes/stripeRouter");
const User = require("./models/User");
require("./utils/connectDB")();
const app = express();
const PORT = process.env.PORT || 3000;

//* Cron for trail period
cron.schedule("0 0 * * * *", async () => {
  console.log("This task runs every day");
  const today = new Date();
  try {
    await User.updateMany(
      {
        trialActive: true,
        trialExpires: { $lt: today },
      },
      {
        trialActive: false,
        monthlyRequestCount: 5,
        subscriptionPlan: "Free",
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//* Cron for Free plan
cron.schedule("0 0 1 * * *", async () => {
  console.log("This task runs at the end of every month");
  const today = new Date();
  try {
    await User.updateMany(
      {
        subscriptionPlan: "Free",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//* Cron for Basic Plan
cron.schedule("0 0 1 * * *", async () => {
  console.log("This task runs at the end of every month");
  const today = new Date();
  try {
    await User.updateMany(
      {
        subscriptionPlan: "Basic",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//* Cron for Premium Plan
cron.schedule("0 0 1 * * *", async () => {
  console.log("This task runs at the end of every month");
  const today = new Date();
  try {
    await User.updateMany(
      {
        subscriptionPlan: "Premium",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//! Middlewares

app.use(express.json());
app.use(cookieParser());

//! Routes

app.use("/api/v1/user", userRouter);
app.use("/api/v1/openai", geminiAIRouter);
app.use("/api/v1/stripe", stripeRouter);

//! Start the server
app.listen(PORT, console.log(`Server is listening on port ${PORT}`));

//! Error handler middleware

app.use(errorHandler);
