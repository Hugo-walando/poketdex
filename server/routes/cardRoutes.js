const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const { authenticateToken } = require('../middlewares/authenticateToken');

router.get('/', authenticateToken, cardController.getAllCards);
router.get('/:id', authenticateToken, cardController.getCardById);
router.get('/set/:set_code', authenticateToken, cardController.getCardsBySet);

module.exports = router;
