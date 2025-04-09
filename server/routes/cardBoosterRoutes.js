const express = require('express');
const router = express.Router();
const cardBoosterController = require('../controllers/cardBoosterController');

router.post('/link', cardBoosterController.addCardToBooster);

module.exports = router;
