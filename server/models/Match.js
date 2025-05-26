const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    user_1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    user_2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    card_offered_by_user_1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card',
      required: true,
    },
    card_offered_by_user_2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'cancelled', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true },
);
matchSchema.index(
  {
    user_1: 1,
    user_2: 1,
    card_offered_by_user_1: 1,
    card_offered_by_user_2: 1,
  },
  { unique: true },
);

module.exports = mongoose.model('Match', matchSchema);
