var express = require("express");
var router = express.Router();
const passport = require("passport");

/* GET post with id. */
router.get("/:id", function (req, res, next) {
  res.json({ title: "posts" });
});

/* GET posts listing. */
router.get("/", function (req, res, next) {
  res.json({ title: "posts" });
});

/* POST post. */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    return res.status(200).json({ message: "YAY! this is a protected Route" });
  }
);

/* PUT post with id. */
router.put("/:id", function (req, res, next) {
  res.json({ title: "updated post" });
});

/* DELETE post with id. */
router.delete("/:id", function (req, res, next) {
  res.json({ title: "deleted post" });
});

module.exports = router;
