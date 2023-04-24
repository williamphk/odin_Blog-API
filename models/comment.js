const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  email: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date },
  post: { type: Schema.Types.ObjectId, ref: "Post" },
});

//Export model
module.exports = mongoose.model("Comment", CommentSchema);
