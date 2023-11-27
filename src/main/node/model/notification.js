const { Schema, model, ObjectId } = require('mongoose');

const NotifcationType = ['MESSAGE', 'SQUEAL', 'SQUEAL_COMMENT', 'REACTION'];
const notificationSchema = new Schema(
  {
    senderId: { type: String, default: null },
    destId: { type: String, default: null },
    squealId: { type: String, default: null },
    timestamp: { type: Number, default: null },
    type: { type: String, enum: NotifcationType, default: 'MESSAGE' },
    isRead: { type: Boolean, default: false },
  },
  { collection: 'notification', _id: true }
);
notificationSchema.index({ name: 1 });
module.exports = model('notification', notificationSchema);
