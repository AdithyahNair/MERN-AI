const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const geminiAIController = require("../controllers/geminiAIController");
const checkApiRequestLimit = require("../middlewares/checkApiRequestLimit");
const geminiAIRouter = express.Router();

geminiAIRouter.post(
  "/generate-content",
  isAuthenticated,
  checkApiRequestLimit,
  geminiAIController
);

module.exports = geminiAIRouter;
