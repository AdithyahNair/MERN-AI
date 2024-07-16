const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    trialPeriod: {
      type: Number,
      default: 3,
    },

    trialActive: {
      type: Boolean,
      default: true,
    },

    trialExpires: {
      type: Date,
    },

    subscriptionPlan: {
      type: String,
      enum: ["Trial", "Free", "Basic", "Premium"],
    },

    apiRequestCount: {
      type: Number,
      default: 0,
    },

    monthlyRequestCount: {
      type: Number,
      default: 100, //* 100 free credits for a month. 3 days available for use
    },

    nextBillingDate: Date,
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
    history: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "History",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//* Add virtual property

userSchema.virtual("isTrialActive").get(function () {
  return this.trialActive && new Date() < this.trialExpires;
});

const User = mongoose.model("User", userSchema);

module.exports = User;
