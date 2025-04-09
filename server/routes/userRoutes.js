const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authenticateToken');

router.get('/me', authenticateToken, userController.getCurrentUser);
router.get('/:id', userController.getUserById);

router.patch('/:id', authenticateToken, userController.updateUser);

module.exports = router;
