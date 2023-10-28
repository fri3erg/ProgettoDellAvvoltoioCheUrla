const { Schema, model, ObjectId } = require('mongoose');

const authoritySchema = new Schema(
  {
    _id: { type: String, unique: true, alias: 'name' },
  },
  { collection: 'jhi_authority' }
);

const userSchema = new Schema(
  {
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    login: { type: String, unique: true, index: true },
    password: { type: String },
    email: { type: String },
    token: { type: String },
    activated: { type: Boolean, default: false },
    img: { type: Array, default: null },
    img_content_type: { type: String, default: null },
    lang_key: { type: String, default: 'en' },
    authorities: [authoritySchema],
  },
  { collection: 'jhi_user', _id: true }
);

module.exports = model('user', userSchema);
