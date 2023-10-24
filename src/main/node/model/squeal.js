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
    user_id: { type: String, alias: 'userId' },
    timestamp: { type: Number, default: null },
    body: { type: String, default: null },
    img: { type: Array, default: null },
    img_content_type: { type: String, default: null, alias: 'imgContentType' },
    img_name: { type: String, default: null, alias: 'imgName' },
    video_content_type: { type: String, default: null, alias: 'videoContentType' },
    video_name: { type: String, default: null, alias: 'videoName' },
    n_characters: { type: Number, default: 0, alias: 'nCharacters' },
    squeal_id_response: { type: String, alias: 'squealIdResponse', default: null },
    refresh_time: { type: Number, alias: 'refreshTime', default: null },
    destination: [destinationSchema],
  },
  { collection: 'squeal', _id: true }
);

module.exports = model('squeal', squealSchema);
