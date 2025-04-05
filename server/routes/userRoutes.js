const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/me', authenticateToken, getCurrentUser);
router.get('/:id', getUserById);

router.patch('/:id', authenticateToken, userController.updateUser);

module.exports = router;
