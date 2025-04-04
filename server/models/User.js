const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
  profile_picture: String,
  friend_code: { type: String, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
