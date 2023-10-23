const { Schema, model, ObjectId } = require('mongoose');

const DestType = {
  PRIVATEGROUP: 'PRIVATEGROUP',
  PUBLICGROUP: 'PUBLICGROUP',
  MOD: 'MOD',
  MESSAGE: 'MESSAGE',
};
const channelSchema = new Schema(
  {
    name: { type: String, unique: true },
    type: { type: DestType, default: null },
    mod_type: { type: String, default: null, alias: 'modType' },
    emergency: { type: Boolean, default: null },
  },
  { collection: 'channel', _id: true }
);
module.exports = model('channel', channelSchema);
