var express = require("express");
var router = express.Router();
const passport = require("passport");
const { JSDOM } = require("jsdom");
const createDOMPurify = require("dompurify");
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

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

/* GET comment with id for post with id. */
router.get("/:postId/comments/:commentId", async (req, res, next) => {
  try {
    const comment = await Comment.find({
      _id: req.params.commentId,
      post: req.params.postId,
    }).populate("post");
    res.json({ comment });
  } catch (err) {
    return next(err);
  }
});

/* GET all comments for post with id. */
router.get("/:id/comments", async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.id }).populate(
      "post"
    );
    res.json({ comments });
  } catch (err) {
    return next(err);
  }
});

/* GET post with id. */
router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json({ post });
  } catch (err) {
    return next(err);
  }
});

/* POST comments post with id. */
router.post(
  "/:id/comments",
  [
    body("email")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email")
      .normalizeEmail(),
    body("content")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Content is required"),
  ],

  async (req, res, next) => {
    // Sanitize input
    const allowedTags = [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "strong",
      "em",
      "u",
      "strike",
      "blockquote",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "pre",
      "code",
      "br",
    ];

    const allowedAttributes = {
      a: ["href", "title", "target"],
      img: ["src", "alt", "title", "width", "height"],
      span: ["style"], // Add this line to allow the 'style' attribute for 'span' elements
    };

    const sanitizedContent = DOMPurify.sanitize(req.body.content, {
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: allowedAttributes,
    });

    const errors = validationResult(req);
    const comment = new Comment({
      email: req.body.email,
      content: sanitizedContent,
      timestamp: new Date(),
      post: req.params.id,
    });
    if (!errors.isEmpty()) {
      return res.status(401).json({ comment, errors: errors.array() });
    }
    try {
      await comment.save();
      res.status(200).json({ message: "Comment created" });
    } catch (err) {
      return next(err);
    }
  }
);

/* POST post. */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  [
    body("title")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Topic is required")
      .escape(),
    body("content")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Content is required"),
  ],

  async (req, res, next) => {
    // Sanitize input
    const allowedTags = [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "strong",
      "em",
      "u",
      "strike",
      "blockquote",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "pre",
      "code",
      "br",
    ];

    const allowedAttributes = {
      a: ["href", "title", "target"],
      img: ["src", "alt", "title", "width", "height"],
      span: ["style"], // Add this line to allow the 'style' attribute for 'span' elements
    };

    const sanitizedContent = DOMPurify.sanitize(req.body.content, {
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: allowedAttributes,
    });

    const errors = validationResult(req);
    const post = new Post({
      title: req.body.title,
      content: sanitizedContent,
      timestamp: new Date(),
      created_by: req.user._id,
      isPublic: req.body.isPublic,
    });
    if (!errors.isEmpty()) {
      return res.status(401).json({ post, errors: errors.array() });
    }

    try {
      await post.save();
      res.status(200).json({ message: "Post created", post });
    } catch (err) {
      return next(err);
    }
  }
);

/* PUT post with id. */
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  [
    body("title").trim().isLength({ min: 1 }).withMessage("Topic is required"),
    body("content")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Content is required"),
  ],
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
  }
);

/* DELETE post with id. */
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.id);
      const comments = await Comment.find({ post: req.params.id });
      if (post == null) {
        return res.status(401).json({ message: "Post not found" });
      }
      await Post.deleteOne({ _id: req.params.id });
      if (comments) {
        await Comment.deleteMany({ post: req.params.id });
      }
      return res
        .status(200)
        .json({ message: "Post and related comments deleted" });
    } catch (err) {
      next(err);
    }
  }
);

/* Delete comment with id. */
router.delete(
  "/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const comment = await Comment.find({
        _id: req.params.commentId,
        post: req.params.postId,
      }).populate("post");
      if (comment == null) {
        return res.status(401).json({ message: "Comment not found" });
      }
      await Comment.deleteOne({ _id: req.params.commentId });
      return res.status(200).json({ message: "Comment deleted" });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
