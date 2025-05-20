const express = require('express');
const router = express.Router();
const { getConnectedUserIds } = require('../socket');
const User = require('../models/User'); // ton modèle Mongoose

router.get('/connected-users', async (req, res) => {
  try {
    const userIds = getConnectedUserIds();

    const users = await User.find({ _id: { $in: userIds } }).select(
      'username profile_picture',
    ); // ou ce que tu veux afficher

    res.status(200).json(users);
  } catch (err) {
    console.error('Erreur récupération users connectés :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
