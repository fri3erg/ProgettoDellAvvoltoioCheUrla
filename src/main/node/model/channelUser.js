const { Schema, model, ObjectId } = require('mongoose');

const PrivilegeType = ['ADMIN', 'WRITE', 'READ'];

const channelUserSchema = new Schema(
  {
    user_id: { type: String },
    channel_id: { type: String },
    privilege: { type: String, enum: PrivilegeType, default: null },
  },
  { collection: 'channel_user', _id: true }
);
module.exports = model('channelUser', channelUserSchema);
