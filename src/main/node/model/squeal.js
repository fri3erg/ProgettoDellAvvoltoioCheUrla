const { Schema, model, ObjectId } = require('mongoose');

const DestType = ['PRIVATEGROUP', 'PUBLICGROUP', 'MOD', 'MESSAGE'];
const destinationSchema = new Schema({
  destination_id: { type: String },
  destination: { type: String, default: null },
  destination_type: { type: String, enum: DestType, default: 'MESSAGE' },
  seen: { type: Number, default: false },
  admin_add: { type: Boolean, default: false },
});

const squealSchema = new Schema(
  {
    user_id: { type: String },
    timestamp: { type: Number, default: null },
    body: { type: String, default: null },
    img: { type: Array, default: null },
    img_content_type: { type: String, default: null },
    img_name: { type: String, default: null },
    video_content_type: { type: String, default: null },
    video_name: { type: String, default: null },
    n_characters: { type: Number, default: 0 },
    squeal_id_response: { type: String, default: null },
    refresh_time: { type: Number, default: null },
    destination: [destinationSchema],
  },
  { collection: 'squeal', _id: true }
);

module.exports = model('squeal', squealSchema);
