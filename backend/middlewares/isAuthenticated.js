const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const isAuthenticated = asyncHandler(async (req, res, next) => {
  if (req.cookies.token) {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET); //* Actual user
    req.user = await User.findById(decoded.id);
    next();
  } else {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }
});

module.exports = isAuthenticated;
