const ListedCard = require('../models/ListedCard');
const Card = require('../models/Card');

// POST /api/listed-cards
const addListedCard = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cardId } = req.body;

    const listedCard = await ListedCard.create({
      user: userId,
      card: cardId,
    });

    await wish.populate('card');

    res.status(201).json(listedCard);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Carte déjà listée.' });
    }
    console.error('Erreur lors de l’ajout d’une carte listée :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// DELETE /api/listed-cards/:cardId
const removeListedCard = async (req, res) => {
  try {
    const userId = req.user.id;
    const cardId = req.params.cardId;

    await ListedCard.findOneAndDelete({ user: userId, card: cardId });

    res.status(204).end();
  } catch (err) {
    console.error('Erreur lors de la suppression d’une carte listée :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// GET /api/listed-cards
const getListedCards = async (req, res) => {
  try {
    const userId = req.user.id;

    const listedCards = await ListedCard.find({ user: userId })
      .populate({
        path: 'card',
      })
      .populate({
        path: 'user',
        select: 'username profile_picture', // ✅ seulement les infos nécessaires
      });

    res.status(200).json(listedCards);
  } catch (err) {
    console.error('Erreur lors de la récupération des cartes listées :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  addListedCard,
  removeListedCard,
  getListedCards,
};
