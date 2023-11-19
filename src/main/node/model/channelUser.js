const { Schema, model, ObjectId } = require('mongoose');

const PrivilegeType = ['ADMIN', 'WRITE', 'READ'];

const channelUserSchema = new Schema(
  {
    user_id: { type: String },
    channel_id: { type: String },
    privilege: { type: String, enum: PrivilegeType, default: 'READ' },
  },
  { collection: 'channel_user', _id: true }
);
channelUserSchema.index({ user_id: 1 });
channelUserSchema.index({ channel_id: 1 });
module.exports = model('channelUser', channelUserSchema);
