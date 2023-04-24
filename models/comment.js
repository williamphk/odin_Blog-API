const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  email: { tyle: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date },
  post: { type: Schema.Types.ObjectId, ref: "post" },
});

CommentSchema.virtual("url").get(function () {
  return `/comments/${this._id}`;
});

//Export model
module.exports = mongoose.model("Comment", CommentSchema);
