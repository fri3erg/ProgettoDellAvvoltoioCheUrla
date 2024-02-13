const { Schema, model, ObjectId } = require('mongoose');

const DestType = ['PRIVATEGROUP', 'PUBLICGROUP', 'MOD', 'MESSAGE'];
const channelSchema = new Schema(
  {
    name: { type: String },
    description: { type: String, default: null },
    type: { type: String, enum: DestType, default: 'MESSAGE' },
    mod_type: { type: String, default: null },
    emergency: { type: Boolean, default: null },
  },
  { collection: 'channel', _id: true }
);
channelSchema.index({ name: 1 });
module.exports = model('channel', channelSchema);
