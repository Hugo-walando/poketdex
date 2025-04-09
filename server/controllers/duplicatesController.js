const Duplicates = require('../models/Duplicates');
const User = require('../models/User');
const Card = require('../models/Card');

const duplicatesController = {
  // Ajouter une carte en double
  addDuplicate: async (req, res) => {
    try {
      const { userId, cardId } = req.body;
      
      // Vérifier que l'utilisateur et la carte existent
      const user = await User.findById(userId);
      const card = await Card.findById(cardId);
      
      if (!user || !card) {
        return res.status(404).json({ message: "Utilisateur ou carte introuvable" });
      }

      const newDuplicate = new Duplicates({ user: userId, card: cardId });
      await newDuplicate.save();
      res.status(201).json(newDuplicate);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Récupérer les doublons d'un utilisateur
  getUserDuplicates: async (req, res) => {
    try {
      const duplicates = await Duplicates.find({ user: req.params.userId }).populate('card');
      res.json(duplicates);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = duplicatesController;
