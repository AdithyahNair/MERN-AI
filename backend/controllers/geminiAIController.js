const asyncHandler = require("express-async-handler");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ContentHistory = require("../models/ContentHistory");
const User = require("../models/User");

//* GeminiAI controller

const geminiAIController = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const content = response.text();

    //* Create user and add this content

    const newContent = await ContentHistory.create({
      user: req.user._id,
      content,
    });

    //* Push history id into the user

    const userFound = await User.findById(req.user._id);

    userFound.history.push(newContent._id);

    //! Update API request count

    userFound.apiRequestCount += 1;

    await userFound.save();

    res.status(200).json(content);
  } catch (error) {
    console.log(error);
  }
});

module.exports = geminiAIController;
