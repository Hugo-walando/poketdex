const express = require('express');
const router = express.Router();
const { createMatch } = require('../controllers/matchController');
const { authenticateToken } = require('../middlewares/authenticateToken');

// Protéger la route par authentification
router.post('/', authenticateToken, createMatch);

module.exports = router;
