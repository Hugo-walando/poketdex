const express = require('express');
const router = express.Router();
const tradeRequestController = require('../controllers/tradeRequestController');
const { authenticateToken } = require('../middlewares/authenticateToken');

router.post('/', authenticateToken, tradeRequestController.createTradeRequest);

router.patch(
  '/:id',
  authenticateToken,
  tradeRequestController.updateTradeRequest,
);

router.patch(
  '/:id/mark-as-sent',
  authenticateToken,
  tradeRequestController.markTradeRequestAsSent,
);

router.get('/me', authenticateToken, tradeRequestController.getMyTradeRequests);

module.exports = router;
