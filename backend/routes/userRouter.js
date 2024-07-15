const express = require("express");
const userController = require("../controllers/userController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const userRouter = express.Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.post("/logout", userController.logout);
userRouter.get("/profile", isAuthenticated, userController.userProfile);

module.exports = userRouter;
