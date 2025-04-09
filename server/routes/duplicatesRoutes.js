const express = require('express');
const router = express.Router();
const duplicatesController = require('../controllers/duplicatesController');

router.post('/', duplicatesController.addDuplicate);
router.get('/user/:userId', duplicatesController.getUserDuplicates);

module.exports = router;
