const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date },
  created_by: { type: Schema.Types.ObjectId, ref: "User" },
  isPublic: { type: Boolean },
});

PostSchema.virtual("url").get(function () {
  return `/posts/${this._id}`;
});

//Export model
module.exports = mongoose.model("Post", PostSchema);
