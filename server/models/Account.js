// models/Account.js
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  type: String,
  provider: String,
  providerAccountId: String,
  refresh_token: String,
  access_token: String,
  expires_at: Number,
  token_type: String,
  scope: String,
  id_token: String,
  session_state: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports =
  mongoose.models.Account || mongoose.model('Account', accountSchema);
