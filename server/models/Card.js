const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  img_url: { type: String, required: true },
  name: { type: String, required: true },
  rarity: { type: Number, required: true },
  official_id: { type: String, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema);
