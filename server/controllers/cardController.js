const Card = require('../models/Card');

const cardController = {
  createCard: async (req, res) => {
    try {
      const { img_url, name, rarity, official_id } = req.body;
      const newCard = new Card({ img_url, name, rarity, official_id });
      const savedCard = await newCard.save();
      res.status(201).json(savedCard);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getAllCards: async (req, res) => {
    try {
      const cards = await Card.find();
      res.json(cards);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = cardController;
