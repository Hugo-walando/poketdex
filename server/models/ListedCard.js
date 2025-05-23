const mongoose = require('mongoose');

const listedCardSchema = new mongoose.Schema(
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

listedCardSchema.index({ user: 1, card: 1 }, { unique: true });

module.exports = mongoose.model('ListedCard', listedCardSchema);
