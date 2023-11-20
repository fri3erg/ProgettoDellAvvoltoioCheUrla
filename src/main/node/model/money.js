const { Schema, model, ObjectId } = require('mongoose');
const moneySchema = new Schema(
  {
    user_id: { type: String },
    n_characters: { type: Number, default: 0 },
    timestamp: { type: Number, default: null },
  },
  { collection: 'money', _id: true }
);
moneySchema.index({ user_id: 1 });
module.exports = model('money', moneySchema);
