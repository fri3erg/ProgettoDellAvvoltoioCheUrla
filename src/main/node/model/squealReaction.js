const { Schema, model, ObjectId } = require('mongoose');

const squealReactionSchema = new Schema(
  {
    squeal_id: { type: String },
    user_id: { type: String },
    username: { type: String, default: null },
    emoji: { type: String, default: null },
    positive: { type: Boolean, default: null },
  },
  { collection: 'squeal_reaction', _id: true }
);
squealReactionSchema.index({ squeal_id: 1 });
squealReactionSchema.index({ user_id: 1 });
module.exports = model('squealReaction', squealReactionSchema);
