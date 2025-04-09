const express = require('express');
const router = express.Router();
const setController = require('../controllers/setController');
const { authenticateToken } = require('../middlewares/authenticateToken');

// Route pour créer un set
router.get('/sets', authenticateToken, setController.getAllSets);

module.exports = router;
