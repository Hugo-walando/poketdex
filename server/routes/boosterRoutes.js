const express = require('express');
const router = express.Router();
const boosterController = require('../controllers/boosterController');

router.post('/', boosterController.createBooster);
router.get('/by-set/:setId', boosterController.getBoostersBySet);

module.exports = router;
