const { Schema, model, ObjectId } = require('mongoose');
const PrivilegeType = {
  POPULAR: 'POPULAR',
  UNPOPULAR: 'UNPOPULAR',
  CONTROVERSIAL: 'CONTROVERSIAL',
};
const squealCatSchema = new Schema(
  {
    squealId: { type: String },
    user_id: { type: String },
    n_characters: { type: Number, default: 0 },
    timestamp: { type: Number, default: null },
  },
  { collection: 'squeal_cat', _id: true }
);
module.exports = model('squealCat', squealCatSchema);
