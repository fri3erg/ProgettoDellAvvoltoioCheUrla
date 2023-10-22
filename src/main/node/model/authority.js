const { Schema, model } = require("mongoose");

const authoritySchema = new Schema({ 
  _id: { type: String, default: null },
}, { collection: 'jhi_authority' });

module.exports = model("authority", authoritySchema);
