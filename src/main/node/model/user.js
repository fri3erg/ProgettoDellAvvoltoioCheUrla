const { Schema, model, ObjectId } = require('mongoose');

const authoritySchema = new Schema(
  {
    _id: { type: String, unique: true, alias: 'name' },
  },
  { collection: 'jhi_authority' }
);

const userSchema = new Schema(
  {
    _id: { type: String, unique: true, alias: 'id' },
    first_name: { type: String, default: null, alias: 'firstName' },
    last_name: { type: String, alias: 'lastName', default: null },
    login: { type: String, unique: true, index: true },
    password: { type: String },
    email: { type: String },
    token: { type: String },
    activated: { type: Boolean, default: false },
    img: { type: Array, default: null },
    img_content_type: { type: String, default: null, alias: 'imgContentType' },
    lang_key: { type: String, default: 'en', alias: 'langKey' },
    authorities: [authoritySchema],
  },
  { collection: 'jhi_user', _id: true }
);

module.exports = model('user', userSchema);
