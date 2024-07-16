const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const handleStripPayment = require("../controllers/handleStripePayment");
const stripeRouter = express.Router();

stripeRouter.post("/checkout", isAuthenticated, handleStripPayment);

module.exports = stripeRouter;
