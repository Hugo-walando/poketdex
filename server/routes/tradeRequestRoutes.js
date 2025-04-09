const express = require('express');
const router = express.Router();
const tradeRequestController = require('../controllers/tradeRequestController');

router.post('/', tradeRequestController.createTradeRequest);

module.exports = router;
