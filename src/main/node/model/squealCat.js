const { Schema, model, ObjectId } = require('mongoose');
const squealCatSchema = new Schema(
  {
    squealId: { type: String },
    user_id: { type: String },
    n_characters: { type: Number, default: 0 },
    timestamp: { type: Number, default: null },
  },
  { collection: 'squeal_cat', _id: true }
);
squealCatSchema.index({ squealId: 1 });
squealCatSchema.index({ user_id: 1 });
module.exports = model('squealCat', squealCatSchema);
