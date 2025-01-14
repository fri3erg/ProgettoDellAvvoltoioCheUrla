const { Schema, model, ObjectId } = require('mongoose');

const NotificationType = ['MESSAGE', 'COMMENT', 'REACTION', 'SMM'];
const ReactionType = ['heart', 'exploding', 'cold', 'nerd', 'clown', 'bored', null];
const notificationSchema = new Schema(
  {
    username: { type: String, default: null },
    reaction: { type: String, enum: ReactionType, default: null },
    body: { type: String, default: null },
    profile_img: { type: Array, default: null },
    profile_img_content_type: { type: String, default: null },
    destId: { type: String, default: null },
    timestamp: { type: Number, default: null },
    type: { type: String, enum: NotificationType, default: 'MESSAGE' },
    isRead: { type: Boolean, default: false },
  },
  { collection: 'notification', _id: true }
);
notificationSchema.index({ senderId: 1 });
notificationSchema.index({ destId: 1 });
module.exports = model('notification', notificationSchema);
