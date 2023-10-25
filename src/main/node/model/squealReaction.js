const { Schema, model, ObjectId } = require('mongoose');

const squealReactionSchema = new Schema(
  {
    squeal_id: { type: String },
    user_id: { type: String },
    username: { type: String, default: null },
    emoji: { type: String, default: null },
    number: { type: Number, default: 0 },
  },
  { collection: 'squeal_reaction', _id: true }
);
module.exports = model('squealReaction', squealReactionSchema);
