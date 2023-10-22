const { Schema, model } = require("mongoose");
const {authority} = require("./authority");



const userSchema = new Schema({
  _id: { type: String },
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  login: { type: String, unique: true },
  password: { type: String },
  email: { type: String },
  token: { type: String },
  activated: { type: Boolean, default: false  },
  img: { type: String, default: null  },
  img_content_type: { type: String, default: null  },
  lang_key: { type: String, default: "eng"  },
  authorities: [authority],
}, { collection: 'jhi_user' });

module.exports = model("user", userSchema);
