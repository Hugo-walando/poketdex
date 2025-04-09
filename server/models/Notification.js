const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['trade_match', 'trade_request', 'trade_accepted', 'trade_cancelled'], 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  is_read: { 
    type: Boolean, 
    default: false 
  },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
