const { Schema, model, ObjectId } = require('mongoose');

const squealViewsSchema = new Schema({
  squeal_id: { type: String, alias: 'squealId' },
  number: { type: Number, default: 0 },
});
module.exports = model('squealViews', squealViewsSchema);
