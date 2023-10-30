const { Schema, model, ObjectId } = require('mongoose');

const userSchema = new Schema(
  {
    user_id: { type: String },
    smm_id: { type: String, sparse: true },
  },
  { collection: 'smmuser', _id: true }
);

module.exports = model('smmUser', userSchema);
