const { Schema, model, ObjectId } = require('mongoose');

const userSchema = new Schema(
  {
    user_id: { type: String },
    users: {
      type: [String],
      sparse: true,
    },
  },
  { collection: 'smmvip', _id: true }
);

module.exports = model('smmVIP', userSchema);
