const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userController = {
  register: asyncHandler(async (req, res) => {
    //! Check if every required data is provided
    const { username, email, password } = req.body;
    if (!email || !username || !password) {
      res.status(400);
      throw new Error("Please enter all the fields!");
    }
    //! Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists. Please login!");
    }
    //! Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //! Create new user
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });

    newUser.trialExpires = new Date(
      new Date().getTime() + newUser.trialPeriod * 24 * 60 * 60 * 1000
    );

    //! Save the new user
    await newUser.save();
    res.status(200).json({
      message: "Registration successful",
      user: {
        username,
        email,
      },
    });
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //* Check for user email

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    console.log(user);

    //* Check if password is valid

    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    //* Using JWT
    const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    console.log(token);
    //* Set token to cookie

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, //* 1 day
    });

    res.json({
      message: "User logged in successfully!",
      user: user?.username,
      email: user?.email,
      id: user?._id,
    });
  }),

  logout: asyncHandler(async (req, res) => {
    res.cookie("token", "", { maxAge: 1 }); //* Clears the authentication cookie

    res.status(200).json({
      message: "Logged out successful!",
    });
  }),

  userProfile: asyncHandler(async (req, res) => {
    const user = await User.findById(req?.user?.id)
      .select("-password")
      .populate("payments")
      .populate("history");
    if (user) {
      res.status(200).json({
        message: "success",
        user,
      });
    } else {
      res.status(404);
      throw new Error("User not found!");
    }
  }),
};

module.exports = userController;
