const { Schema, model, ObjectId } = require('mongoose');

const DestType = {
  PRIVATEGROUP: 'PRIVATEGROUP',
  PUBLICGROUP: 'PUBLICGROUP',
  MOD: 'MOD',
  MESSAGE: 'MESSAGE',
};

const squealDestinationSchema = new Schema({
  destination_id: { type: String },
  destination: { type: String, default: null },
  destination_type: { type: DestType, default: null },
  seen: { type: Number, default: false },
  admin_add: { type: Boolean, default: false },
  squeal: { type: ObjectId, ref: 'squeal' },
});

function transformDocument(doc) {
  return {
    destinationId: destination_id,
    destination: doc.destination,
  };
}

module.exports = model('squealDestination', squealDestinationSchema);
