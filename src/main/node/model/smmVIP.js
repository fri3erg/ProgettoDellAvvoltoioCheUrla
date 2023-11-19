const { Schema, model, ObjectId } = require('mongoose');

const smmvipSchema = new Schema(
  {
    user_id: { type: String },
    users: {
      type: [String],
      sparse: true,
    },
  },
  { collection: 'smmvip', _id: true }
);
smmvipSchema.index({ user_id: 1 });
module.exports = model('smmVIP', smmvipSchema);
