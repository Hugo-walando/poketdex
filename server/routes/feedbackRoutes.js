const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

router.post('/', async (req, res) => {
  try {
    const { type, message, email, username } = req.body;

    if (!type || !message || !email) {
      return res.status(400).json({ error: 'Champs requis manquants.' });
    }

    await Feedback.create({
      type,
      message,
      email,
      username: username || null,
    });

    res.status(201).json({ success: true });
  } catch (err) {
    console.error('❌ Erreur lors de la création du feedback :', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.get('/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error('Erreur récupération feedbacks :', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
