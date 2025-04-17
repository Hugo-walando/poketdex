const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { authenticateToken } = require('../middlewares/authenticateToken');

// Protéger la route par authentification
router.post('/', authenticateToken, matchController.createMatch);

router.get('/me', authenticateToken, matchController.getMatchesForCurrentUser);

module.exports = router;
