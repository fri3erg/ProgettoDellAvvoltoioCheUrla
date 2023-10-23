const { Schema, model, ObjectId } = require('mongoose');

const PrivilegeType = {
  ADMIN: 'ADMIN',
  WRITE: 'WRITE',
  READ: 'READ',
};

const channelUserSchema = new Schema({
  user_id: { type: String, alias: 'userId' },
  channel_id: { type: String, alias: 'channelId' },
  privilege: { type: PrivilegeType, default: null },
});
module.exports = model('channelUser', channelUserSchema);
