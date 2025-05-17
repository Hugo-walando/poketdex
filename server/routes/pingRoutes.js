const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  console.log('🔁 Ping reçu à', new Date().toISOString());
  res.status(200).send('pong');
});

module.exports = router;
