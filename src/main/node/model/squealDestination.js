const { Schema, model, ObjectId } = require('mongoose');

const DestType = {
  PRIVATEGROUP: 'PRIVATEGROUP',
  PUBLICGROUP: 'PUBLICGROUP',
  MOD: 'MOD',
  MESSAGE: 'MESSAGE',
};

const squealDestinationSchema = new Schema({
  destination_id: { type: String, unique: true, alias: 'destinationId' },
  destination: { type: String, default: null },
  destination_type: { type: DestType, default: null, alias: 'destinationType' },
  seen: { type: Number, default: false },
  admin_add: { type: Boolean, default: false, alias: 'adminAdd' },
  squeal: { type: ObjectId, ref: 'squeal' },
});
module.exports = model('squealDestination', squealDestinationSchema);
