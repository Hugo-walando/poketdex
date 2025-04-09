const mongoose = require('mongoose');

const setSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    color: { type: String, required: true },
    card_count: { type: Number, required: true },
    img_url: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model('Set', setSchema);
