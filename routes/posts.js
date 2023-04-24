var express = require("express");
var router = express.Router();
const passport = require("passport");

const { body, validationResult } = require("express-validator");

const Post = require("../models/post");
const Comment = require("../models/comment");

/* GET public posts listing. */
router.get("/public", async (req, res, next) => {
  try {
    const posts = await Post.find(
      { isPublic: true },
      "title content timestamp created_by"
    ).sort({
      title: 1,
    });
    res.json({ posts });
  } catch (err) {
    return next(err);
  }
});

/* GET all posts listing. */
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const posts = await Post.find(
        {},
        "title content timestamp created_by"
      ).sort({
        title: 1,
      });
      res.json({ posts });
    } catch (err) {
      return next(err);
    }
  }
);

/* GET post with id. */
router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json({ post });
  } catch (err) {
    return next(err);
  }
});

/* GET all comments for post with id. */
router.get("/:id/comments", async (req, res, next) => {
  try {
    const comments = await Comment.find(
      { post: req.params.id }.populate("post")
    );
    res.json({ comments });
  } catch (err) {
    return next(err);
  }
});

/* POST comments. */

/* POST post. */
router.post("/", passport.authenticate("jwt", { session: false }), [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Topic is required")
    .escape(),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Content is required")
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      timestamp: new Date(),
      created_by: req.user._id,
      isPublic: req.body.isPublic,
    });
    if (!errors.isEmpty()) {
      return res.status(401).json({ post, errors: errors.array() });
    }
    try {
      await post.save();
      res.status(200).json({ message: "Post created" });
    } catch (err) {
      return next(err);
    }
  },
]);

/* PUT post with id. */
router.put("/:id", passport.authenticate("jwt", { session: false }), [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Topic is required")
    .escape(),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Content is required")
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      timestamp: new Date(),
      created_by: req.user._id,
      isPublic: req.body.isPublic,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.json({ post, errors: errors.array() });
      return next(errors);
    }
    try {
      await Post.updateOne({ _id: req.params.id }, post);
      return res.status(200).json({ message: "Post Updated" });
    } catch (err) {
      return next(err);
    }
  },
]);

/* DELETE post with id. */
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post == null) {
        return res.status(401).json({ message: "Post not found" });
      }
      await Post.deleteOne({ _id: req.params.id });
      return res.status(200).json({ message: "Post deleted" });
    } catch (err) {
      next(err);
    }
  }
);

/* Delete comment with id. */
router.delete(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.json({ title: "deleted comment" });
  }
);

module.exports = router;
