const TradeRequest = require('../models/TradeRequest');

const tradeRequestController = {
  createTradeRequest: async (req, res) => {
    try {
      const { senderId, receiverId, cardOffered, cardRequested } = req.body;
      
      const newRequest = new TradeRequest({
        sender: senderId,
        receiver: receiverId,
        card_offered: cardOffered,
        card_requested: cardRequested
      });

      await newRequest.save();
      res.status(201).json(newRequest);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = tradeRequestController;
