const WishlistCard = require('../models/WishlistCard');
const Card = require('../models/Card');

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
    const userId = req.user.id;
    const cardId = req.params.cardId;

    await WishlistCard.findOneAndDelete({ user: userId, card: cardId });

    res.status(204).end();
  } catch (err) {
    console.error('Erreur lors de la suppression de la wishlist :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// GET /api/wishlist-cards
const getWishlistCards = async (req, res) => {
  try {
    const userId = req.user.id;

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
