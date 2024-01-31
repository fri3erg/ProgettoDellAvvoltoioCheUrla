const { Schema, model, ObjectId } = require('mongoose');
const moneySchema = new Schema(
  {
    user_id: { type: String },
    n_characters: { type: Number, default: 500 },
    timestamp: { type: Number, default: null },
    amount: { type: Number, default: 0.99 },
    currency: { type: String, default: 'EUR' },
    status: { type: String, default: 'KO' },
    mac: { type: String, default: null },
  },
  { collection: 'money', _id: true }
);
moneySchema.index({ user_id: 1 });
module.exports = model('money', moneySchema);
