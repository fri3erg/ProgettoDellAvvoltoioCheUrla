const { Schema, model, ObjectId } = require('mongoose');
const adminExtraSchema = new Schema(
  {
    user_id: { type: String },
    n_characters: { type: Number, default: 0 },
    timestamp: { type: Number, default: null },
    admin_created: { type: String },
    valid_until: { type: Number, default: null },
  },
  { collection: 'admin_extra', _id: true }
);
adminExtraSchema.index({ user_id: 1 });
module.exports = model('admin_extra', adminExtraSchema);
