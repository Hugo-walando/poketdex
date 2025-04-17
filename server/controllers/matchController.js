const Match = require('../models/Match');

const createMatch = async (req, res) => {
  try {
    const { user_1, user_2, card_offered_by_user_1, card_offered_by_user_2 } =
      req.body;

    if (
      !user_1 ||
      !user_2 ||
      !card_offered_by_user_1 ||
      !card_offered_by_user_2
    ) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const match = await Match.create({
      user_1,
      user_2,
      card_offered_by_user_1,
      card_offered_by_user_2,
    });

    res.status(201).json(match);
  } catch (error) {
    console.error('Erreur création match :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  createMatch,
};
