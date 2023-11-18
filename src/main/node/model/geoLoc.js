const { Schema, model, ObjectId } = require('mongoose');

const geoLocSchema = new Schema(
  {
    squeal_id: { type: String },
    user_id: { type: String },
    latitude: { type: String, default: null },
    longitude: { type: String, default: null },
    accuracy: { type: String, default: null },
    heading: { type: String, default: null },
    speed: { type: String, default: null },
    timestamp: { type: Number, default: null },
    refresh: { type: Boolean, default: false },
  },
  { collection: 'geo_loc', _id: true }
);
module.exports = model('geoLoc', geoLocSchema);
