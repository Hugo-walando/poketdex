const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['problem', 'suggestion', 'other'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Feedback', feedbackSchema);
