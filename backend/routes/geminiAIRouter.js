const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const geminiAIController = require("../controllers/geminiAIController");
const geminiAIRouter = express.Router();

geminiAIRouter.post("/generate-content", isAuthenticated, geminiAIController);

module.exports = geminiAIRouter;
