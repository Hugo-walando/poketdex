const express = require('express');
const router = express.Router();
const listedCardController = require('../controllers/listedCardController');

router.post('/', listedCardController.addListedCard);
router.get('/user/:userId', listedCardController.getUserListedCard);

module.exports = router;
