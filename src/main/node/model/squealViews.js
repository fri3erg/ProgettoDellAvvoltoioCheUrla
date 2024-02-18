const { Schema, model, ObjectId } = require('mongoose');

const squealViewsSchema = new Schema(
  {
    squeal_id: { type: String },
    user_id: { type: String },
    number: { type: Number, default: 0 },
  },
  { collection: 'squeal_views', _id: true }
);
squealViewsSchema.index({ squeal_id: 1 });
module.exports = model('squealViews', squealViewsSchema);
