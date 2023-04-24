var express = require("express");
var router = express.Router();

/* POST login */
router.post("/", function (req, res, next) {
  res.json({ title: "Login" });
});

module.exports = router;
