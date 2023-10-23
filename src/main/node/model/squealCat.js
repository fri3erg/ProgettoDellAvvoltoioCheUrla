const { Schema, model, ObjectId } = require('mongoose');
const PrivilegeType = {
  POPULAR: 'POPULAR',
  UNPOPULAR: 'WRUNPOPULARTE',
  CONTROVERSIAL: 'CONTROVERSIAL',
};
const squealCatSchema = new Schema({
  squeal_id: { type: String, alias: 'squealId' },
  user_id: { type: String, alias: 'userId' },
  n_characters: { type: Number, alias: 'nCharacters', default: 0 },
  timestamp: { type: Number, default: null },
});
module.exports = model('squealCat', squealCatSchema);
