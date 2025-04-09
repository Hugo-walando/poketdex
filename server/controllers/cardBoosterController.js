const CardBooster = require('../models/Card_Booster');

const cardBoosterController = {
  addCardToBooster: async (req, res) => {
    try {
      const { cardId, boosterId } = req.body;
      const newRelation = new CardBooster({ card: cardId, booster: boosterId });
      await newRelation.save();
      res.status(201).json(newRelation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = cardBoosterController;
