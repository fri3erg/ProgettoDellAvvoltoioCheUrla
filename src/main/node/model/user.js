const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  login: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
}, { collection: 'jhi_user' });

module.exports = model("user", userSchema);
