const { Schema, model, ObjectId } = require('mongoose');

const Authority = ['ROLE_USER', 'ROLE_SMM', 'ROLE_ADMIN', 'ROLE_VIP'];

const userSchema = new Schema(
  {
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    login: { type: String, unique: true, index: true },
    password: { type: String },
    email: { type: String },
    token: { type: String },
    activation_key: { type: String, default: null },
    activated: { type: Boolean, default: false },
    img: { type: Array, default: null },
    img_content_type: { type: String, default: null },
    lang_key: { type: String, default: 'en' },
    authorities: [{ type: String, enum: Authority }],
  },
  { collection: 'jhi_user', _id: true }
);

module.exports = model('user', userSchema);
