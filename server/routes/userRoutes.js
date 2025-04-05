const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/me', authenticateToken, getCurrentUser);
router.get('/:id', getUserById);

module.exports = router;
