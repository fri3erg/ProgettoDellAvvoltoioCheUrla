const { Schema, model, ObjectId } = require('mongoose');

const squealReactionSchema = new Schema({
  squeal_id: { type: String, alias: 'squealId' },
  user_id: { type: String, alias: 'userId' },
  username: { type: String, default: null },
  emoji: { type: String, default: null },
  number: { type: Number, default: 0 },
});
module.exports = model('squealReaction', squealReactionSchema);
