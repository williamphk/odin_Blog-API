var express = require("express");
var router = express.Router();

/* GET user with id. */
router.get("/:id", function (req, res, next) {
  res.json({ title: "users" });
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.json({ title: "users" });
});

/* POST user. */
router.post("/", function (req, res, next) {
  res.json({ title: "created user" });
});

/* PUT user with id. */
router.put("/:id", function (req, res, next) {
  res.json({ title: "updated user" });
});

/* DELETE user with id. */
router.delete("/:id", function (req, res, next) {
  res.json({ title: "deleted user" });
});

module.exports = router;
