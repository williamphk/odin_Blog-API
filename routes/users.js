var express = require("express");
var router = express.Router();

const User = require("../models/user");

const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");

/* GET user with id. */
router.get("/:id", function (req, res, next) {
  res.json({ title: "users" });
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.json({ title: "users" });
});

/* POST user. */
router.post("/", [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("First name is required")
    .escape(),
  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Last name is required")
    .escape(),
  body("email")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail()
    .custom(async (email) => {
      const user = await User.findOne({ email: email });
      if (user) {
        // If a user with the provided email exists, throw an error
        throw new Error("Email already exists");
      }
      return true;
    })
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .escape(),
  body("confirm_password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Confirm password is required")
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        // If the password do not match, throw an error
        throw new Error("Passwords do not match");
      }
      return true;
    })
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
    });

    if (!errors.isEmpty()) {
      res.json({ user, errors: errors.array() });
    }
    bcrypt.hash(user.password, 10, async (err, hashedPassword) => {
      user.password = hashedPassword;
      try {
        await user.save();
        res.json({ title: "created user" });
      } catch (err) {
        return next(err);
      }
    });
  },
]);

/* PUT user with id. */
router.put("/:id", function (req, res, next) {
  res.json({ title: "updated user" });
});

/* DELETE user with id. */
router.delete("/:id", function (req, res, next) {
  res.json({ title: "deleted user" });
});

module.exports = router;
