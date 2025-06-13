const express = require('express');
const router = express.Router();
const tradeRequestController = require('../controllers/tradeRequestController');
const { authenticateToken } = require('../middlewares/authenticateToken');

router.patch(
  '/:id',
  authenticateToken,
  tradeRequestController.updateTradeRequest,
);

router.patch(
  '/:id/mark-as-sent',
  authenticateToken,
  tradeRequestController.toggleMarkTradeRequestAsSent,
);

router.post(
  '/batch',
  authenticateToken,
  tradeRequestController.createMultipleTradeRequests,
);

router.get('/me', authenticateToken, tradeRequestController.getMyTradeRequests);

router.post(
  '/quick',
  authenticateToken,
  tradeRequestController.createQuickTradeRequest,
);

module.exports = router;
