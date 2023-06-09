var express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
var bcrypt = require("bcryptjs");
require("dotenv").config();

var router = express.Router();

/* POST login */
router.post("/", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Find the user with the provided username
    const user = await User.findOne({ email });
    // If the user is not found, return with a message
    if (!user) {
      return res.status(401).json({ message: "Incorrect email" });
    }

    // Compare the provided password with the stored hashed password
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return next(err);
      }

      if (result) {
        // If the passwords match, log the user in
        const secret = `${process.env.SECRET}`;
        const token = jwt.sign({ email }, secret, { expiresIn: "1h" });
        const userResponse = {
          _id: user._id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
        };
        return res.status(200).json({
          message: "Login successful",
          token,
          userResponse,
        });
      } else {
        // If the passwords do not match, return with a message
        return res.status(401).json({ message: "Incorrect password" });
      }
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
