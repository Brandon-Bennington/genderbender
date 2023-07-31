// auth-middleware.js

const User = require("../models/User");  // Following the new naming convention for the User model
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ status: false, message: "Unauthorized: No token provided." });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, decoded) => {
    if (err) {
     return res.status(401).json({ status: false, message: "Unauthorized: Token verification failed." });
    } else {
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;  // Add user to the request
        next();
      } else {
        return res.status(404).json({ status: false, message: "User not found." });
      }
    }
  });
};