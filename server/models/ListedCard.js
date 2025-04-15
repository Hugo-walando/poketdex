const mongoose = require('mongoose');

const ListedCardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    card: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card',
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('ListedCard', ListedCardSchema);
