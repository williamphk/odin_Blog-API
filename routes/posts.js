var express = require("express");
var router = express.Router();

/* GET post with id. */
router.get("/:id", function (req, res, next) {
  res.json({ title: "posts" });
});

/* GET posts listing. */
router.get("/", function (req, res, next) {
  res.json({ title: "posts" });
});

/* POST post. */
router.post("/", function (req, res, next) {
  res.json({ title: "created post" });
});

/* PUT post with id. */
router.put("/:id", function (req, res, next) {
  res.json({ title: "updated post" });
});

/* DELETE post with id. */
router.delete("/:id", function (req, res, next) {
  res.json({ title: "deleted post" });
});

module.exports = router;
