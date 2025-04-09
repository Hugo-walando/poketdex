const mongoose = require('mongoose');

const cardBoosterSchema = new mongoose.Schema({
  card: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Card', 
    required: true 
  },
  booster: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booster', 
    required: true 
  },
}, { timestamps: true });

module.exports = mongoose.model('Card_Booster', cardBoosterSchema);
