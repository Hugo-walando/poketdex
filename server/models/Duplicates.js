const mongoose = require('mongoose');

const duplicatesSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  card: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Card', 
    required: true 
  },
}, { timestamps: true });

module.exports = mongoose.model('Duplicates', duplicatesSchema);
