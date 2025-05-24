const mongoose = require('mongoose');

const setSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    color: { type: String, required: true },
    card_count: { type: Number, required: true },
    img_url: { type: String, required: true },
    release_date: { type: Date, required: true },
    is_tradeable: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Set', setSchema);
