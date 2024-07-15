const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reference: {
      type: String,
      required: true,
    },

    currency: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "pending",
      required: true,
    },

    subscription: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      default: 0,
    },

    monthlyRequestCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
