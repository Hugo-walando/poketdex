const ListedCard = require('../models/ListedCard');
const WishlistCard = require('../models/WishlistCard');
const Card = require('../models/Card');
const Match = require('../models/Match');

const { findAndCreateMatch } = require('../services/matchService');

// POST /api/listed-cards
const addListedCard = async (req, res) => {
  try {
    console.log('🔧 Requête d’ajout à la wishlist');
    console.log('USer', req.user);
    console.log('User ID:', req.user._id);
    const userId = req.user._id;
    const { cardId } = req.body;

    // ⚡ Étape 1 : vérifier si la carte est déjà dans Wishlist
    const wishlistCard = await WishlistCard.findOne({
      user: userId,
      card: cardId,
    });

    if (wishlistCard) {
      console.log('🧹 Carte présente dans Wishlist → suppression');
      await WishlistCard.findOneAndDelete({ user: userId, card: cardId });
    }

    // ⚡ Étape 2 : vérifier si elle est déjà listée
    const listedExists = await ListedCard.findOne({
      user: userId,
      card: cardId,
    });
    if (listedExists) {
      return res
        .status(409)
        .json({ message: 'Carte déjà présente dans la liste.' });
    }

    // ⚡ Étape 3 : ajouter dans Listed
    const listed = await ListedCard.create({
      user: userId,
      card: cardId,
    });

    console.log('✅ Carte ajoutée à la liste');

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
    const userId = req.user._id;
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

    console.log('✅ Carte listée supprimée');

    const deletedMatches = await Match.deleteMany({
      $or: [
        { user_1: userId, card_offered_by_user_1: cardId },
        { user_2: userId, card_offered_by_user_2: cardId },
      ],
    });

    console.log(
      `🗑️ ${deletedMatches.deletedCount} match(s) supprimé(s) car liés à cette carte et à cet utilisateur`,
    );

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
