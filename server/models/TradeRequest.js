const mongoose = require('mongoose');

const tradeRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    card_offered: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card',
      required: true,
    },
    card_requested: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'cancelled'],
      default: 'pending',
    },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

tradeRequestSchema.index({ sender: 1 });
tradeRequestSchema.index({ receiver: 1 });

module.exports = mongoose.model('TradeRequest', tradeRequestSchema);
