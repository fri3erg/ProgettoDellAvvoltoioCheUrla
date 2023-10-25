const { Schema, model, ObjectId } = require('mongoose');

const DestType = {
  PRIVATEGROUP: 'PRIVATEGROUP',
  PUBLICGROUP: 'PUBLICGROUP',
  MOD: 'MOD',
  MESSAGE: 'MESSAGE',
};
const destinationSchema = new Schema({
  destination_id: { type: String, alias: 'destinationId' },
  destination: { type: String, default: null },
  destination_type: { type: DestType, default: null, alias: 'destinationType' },
  seen: { type: Number, default: false },
  admin_add: { type: Boolean, default: false, alias: 'adminAdd' },
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

function transformSqueal(doc) {
  return {
    userId: doc.user_id,
    timestamp: doc.timestamp,
    body: doc.body,
    img: doc.img,
    imgContentType: doc.img_content_type,
    imgName: doc.img_name,
    videoContentType: doc.video_content_type,
    videoName: doc.video_name,
    nCharacters: doc.n_characters,
    squealIdResponse: doc.squeal_id_response,
    refresh_time: doc.refreshTime,
    destination: doc.destination,
  };
}

module.exports = model('squeal', squealSchema);
