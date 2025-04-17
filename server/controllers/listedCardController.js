const ListedCard = require('../models/ListedCard');
const Card = require('../models/Card');

// POST /api/listed-cards
const addListedCard = async (req, res) => {
  try {
    console.log('🔧 Requête d’ajout à la wishlist');
    console.log('USer', req.user);
    console.log('User ID:', req.user._id);
    const userId = req.user._id;
    const { cardId } = req.body;

    const listed = await ListedCard.create({
      user: userId,
      card: cardId,
    });

    // 🧠 Lancer la recherche de match
    await findAndCreateMatch(userId, cardId, 'listed');

    await listed.populate('card');

    res.status(201).json(listed);
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
    console.log('🔧 Requête de suppression de carte listée');
    const userId = req.user._id; // <-- doit être l'ObjectId du user
    const cardId = req.params.cardId;

    const deleted = await ListedCard.findOneAndDelete({
      user: userId,
      card: cardId,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: 'Carte non trouvée dans les cartes listées.' });
    }

    res.status(204).end();
  } catch (err) {
    console.error('Erreur lors de la suppression de la carte listée :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// GET /api/listed-cards
const getListedCards = async (req, res) => {
  try {
    const userId = req.user._id;

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
