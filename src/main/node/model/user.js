const { Schema, model, ObjectId } = require('mongoose');
const config = require('../config/env.js');
const Authority = ['ROLE_USER', 'ROLE_SMM', 'ROLE_ADMIN', 'ROLE_VIP'];
const BASE_IMG = config.BASE_IMG;
const userSchema = new Schema(
  {
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    login: { type: String, unique: true, index: true },
    password: { type: String },
    email: { type: String },
    token: { type: String },
    timestamp: { type: Number, default: null },
    activation_key: { type: String, default: null },
    timestamp_activation: { type: Number, default: null },
    activated: { type: Boolean, default: false },
    img: {
      type: Array,
      default: BASE_IMG,
    },
    img_content_type: { type: String, default: 'image/jpeg' },
    lang_key: { type: String, default: 'en' },
    authorities: [{ type: String, enum: Authority }],
  },
  { collection: 'jhi_user', _id: true }
);
userSchema.index({ login: 1 });
module.exports = model('user', userSchema);
