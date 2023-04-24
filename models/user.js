const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

//Virtual for user's fullname
UserSchema.virtual("fullname").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

UserSchema.virtual("url").get(function () {
  return `/users/${this._id}`;
});

//Export model
module.exports = mongoose.model("User", UserSchema);
