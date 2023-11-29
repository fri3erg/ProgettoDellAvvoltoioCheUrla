const { Schema, model, ObjectId } = require('mongoose');

const NotificationType = ['MESSAGE', 'SQUEAL', 'SQUEAL_COMMENT', 'REACTION'];
const notificationSchema = new Schema(
  {
    senderId: { type: String, default: null },
    destId: { type: String, default: null },
    squealId: { type: String, default: null },
    timestamp: { type: Number, default: null },
    type: { type: String, enum: NotificationType, default: 'MESSAGE' },
    isRead: { type: Boolean, default: false },
  },
  { collection: 'notification', _id: true }
);
notificationSchema.index({ senderId: 1 });
notificationSchema.index({ destId: 1 });
module.exports = model('notification', notificationSchema);
