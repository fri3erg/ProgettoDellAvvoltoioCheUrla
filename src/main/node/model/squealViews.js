const { Schema, model, ObjectId } = require('mongoose');

const squealViewsSchema = new Schema(
  {
    squeal_id: { type: String, alias: 'squealId' },
    number: { type: Number, default: 0 },
  },
  { collection: 'squeal_views', _id: true }
);
module.exports = model('squealViews', squealViewsSchema);
