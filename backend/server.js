const express = require("express");
const userRouter = require("./routes/userRouter");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const errorHandler = require("./middlewares/errorMiddleware");
const geminiAIRouter = require("./routes/geminiAIRouter");
require("./utils/connectDB")();
const app = express();
const PORT = process.env.PORT || 3000;

//! Middlewares

app.use(express.json());
app.use(cookieParser());

//! Routes

app.use("/api/v1/user", userRouter);
app.use("/api/v1/openai", geminiAIRouter);

//! Start the server
app.listen(PORT, console.log(`Server is listening on port ${PORT}`));

//! Error handler middleware

app.use(errorHandler);
``;
