const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    profile_picture: { type: String, default: '/avatars/Av1.png' },
    friend_code: { type: String, unique: true, sparse: true },
    is_connected: { type: Boolean, default: false },
    wishlist_cards: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'WishlistCard' },
    ],
    trade_count: {
      type: Number,
      default: 0,
    },
    last_seen: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', userSchema);
