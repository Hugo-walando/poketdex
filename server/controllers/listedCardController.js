const ListedCard = require('../models/ListedCard');
const User = require('../models/User');
const Card = require('../models/Card');

const listedCardController = {
  // Ajouter une carte en double
  addListedCard: async (req, res) => {
    try {
      const { userId, cardId } = req.body;

      // Vérifier que l'utilisateur et la carte existent
      const user = await User.findById(userId);
      const card = await Card.findById(cardId);

      if (!user || !card) {
        return res
          .status(404)
          .json({ message: 'Utilisateur ou carte introuvable' });
      }

      const newListedCard = new ListedCard({ user: userId, card: cardId });
      await newListedCard.save();
      res.status(201).json(newListedCard);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Récupérer les doublons d'un utilisateur
  getUserListedCard: async (req, res) => {
    try {
      const listedCard = await ListedCard.find({
        user: req.params.userId,
      }).populate('card');
      res.json(listedCard);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = listedCardController;
