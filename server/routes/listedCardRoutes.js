const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authenticateToken');
const listedCardController = require('../controllers/listedCardController');

// Créer une carte listée (doublon)
router.post('/', authenticateToken, listedCardController.addListedCard);

// Supprimer une carte listée
router.delete(
  '/:cardId',
  authenticateToken,
  listedCardController.removeListedCard,
);

// Obtenir toutes les cartes listées de l’utilisateur
router.get('/', authenticateToken, listedCardController.getListedCards);

module.exports = router;
