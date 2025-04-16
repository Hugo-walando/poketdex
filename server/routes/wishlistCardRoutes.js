const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authenticateToken');
const wishlistCardController = require('../controllers/wishlistCardController');

// Ajouter une carte à la wishlist
router.post('/', authenticateToken, wishlistCardController.addWishlistCard);

// Supprimer une carte de la wishlist
router.delete(
  '/:cardId',
  authenticateToken,
  wishlistCardController.removeWishlistCard,
);

// Récupérer la wishlist de l’utilisateur
router.get('/', authenticateToken, wishlistCardController.getWishlistCards);

module.exports = router;
