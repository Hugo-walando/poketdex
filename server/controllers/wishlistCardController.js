const WishlistCard = require('../models/WishlistCard');
const Card = require('../models/Card');
const Match = require('../models/Match');
const { findAndCreateMatch } = require('../services/matchService');

// POST /api/wishlist-cards
const addWishlistCard = async (req, res) => {
  try {
    console.log('🔧 Requête d’ajout à la wishlist');
    console.log('USer', req.user);
    console.log('User ID:', req.user._id);
    const userId = req.user._id;
    const { cardId } = req.body;

    console.log('User ID:', userId);
    console.log('Card ID:', cardId);
    console.log('Ajout de la carte à la wishlist');

    const wishlist = await WishlistCard.create({
      user: userId,
      card: cardId,
    });
    // 🧠 Lancer la recherche de match
    await findAndCreateMatch(userId, cardId, 'wishlist');

    await wishlist.populate('card');

    res.status(201).json(wishlist);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: 'Carte déjà présente dans la wishlist.' });
    }
    console.error('Erreur lors de l’ajout à la wishlist :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// DELETE /api/wishlist-cards/:cardId
const removeWishlistCard = async (req, res) => {
  try {
    console.log('🔧 Requête de suppression de carte wishlist');
    const userId = req.user._id;
    const cardId = req.params.cardId;

    const deleted = await WishlistCard.findOneAndDelete({
      user: userId,
      card: cardId,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: 'Carte non trouvée dans la wishlist.' });
    }

    console.log('✅ Carte wishlist supprimée');

    const deletedMatches = await Match.deleteMany({
      $or: [
        { user_1: userId, card_offered_by_user_2: cardId },
        { user_2: userId, card_offered_by_user_1: cardId },
      ],
    });

    console.log(
      `🗑️ ${deletedMatches.deletedCount} match(s) supprimé(s) car liés à cette carte de wishlist`,
    );

    res.status(204).end();
  } catch (err) {
    console.error('Erreur lors de la suppression de la wishlist :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// GET /api/wishlist-cards
const getWishlistCards = async (req, res) => {
  try {
    const userId = req.user._id;

    const wishlistCards = await WishlistCard.find({ user: userId })
      .populate({
        path: 'card',
      })
      .populate({
        path: 'user',
        select: 'username avatar_url', // ✅ pareil ici
      });

    res.status(200).json(wishlistCards);
  } catch (err) {
    console.error(
      'Erreur lors de la récupération des cartes souhaitées :',
      err,
    );
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
module.exports = { addWishlistCard, removeWishlistCard, getWishlistCards };
