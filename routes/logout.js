var express = require("express");
var router = express.Router();

/* POST logout. */
router.post("/", function (req, res, next) {
  res.json({ title: "Logout" });
});

module.exports = router;
