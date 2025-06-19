const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    img_url: { type: String, required: true },
    name: { type: String, required: true },
    rarity: { type: Number, required: true },
    official_id: { type: String },
    set_code: { type: String, required: true },
    tradeable: {
      type: Boolean,
      default: function () {
        return this.rarity <= 5;
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Card', cardSchema);
