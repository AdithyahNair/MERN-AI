const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  handleStripPayment,
  handleFreeSubscription,
} = require("../controllers/handleStripePayment");
const stripeRouter = express.Router();

stripeRouter.post("/checkout", isAuthenticated, handleStripPayment);
stripeRouter.post("/free-plan", isAuthenticated, handleFreeSubscription);

module.exports = stripeRouter;
