const { Schema, model, ObjectId } = require('mongoose');

const DestType = ['PRIVATEGROUP', 'PUBLICGROUP', 'MOD', 'MESSAGE'];

const squealDestinationSchema = new Schema({
  destination_id: { type: String },
  destination: { type: String, default: null },
  destination_type: { type: String, enum: DestType, default: 'MESSAGE' },
  seen: { type: Number, default: false },
  admin_add: { type: Boolean, default: false },
  squeal: { type: ObjectId, ref: 'squeal' },
});
squealDestinationSchema.index({ destination_id: 1 });
squealDestinationSchema.index({ destination: 1 });
module.exports = model('squealDestination', squealDestinationSchema);
