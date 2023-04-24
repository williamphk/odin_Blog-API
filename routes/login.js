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
      return res.status(401).json({ message: "Incorrect username" });
    }

    // Compare the provided password with the stored hashed password
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return next(err);
      }

      if (result) {
        // If the passwords match, log the user in
        const opts = {};
        opts.expiresIn = 120; //token expires in 2min
        const secret = `${process.env.SECRET}`;
        const token = jwt.sign({ email }, secret, opts);
        return res.status(200).json({
          message: "Login successful",
          token,
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
