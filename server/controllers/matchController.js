const Match = require('../models/Match');

const matchController = {
  // Créer un match
  createMatch: async (req, res) => {
    try {
      const { user1, user2, card1, card2 } = req.body;
      
      const newMatch = new Match({
        user_1: user1,
        user_2: user2,
        card_offered_by_user_1: card1,
        card_offered_by_user_2: card2
      });

      await newMatch.save();
      res.status(201).json(newMatch);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Mettre à jour le statut d'un match
  updateMatchStatus: async (req, res) => {
    try {
      const updatedMatch = await Match.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );
      res.json(updatedMatch);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = matchController;
