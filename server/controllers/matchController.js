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

const getMatchesForCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id; // Injecté par authenticateToken

    const matches = await Match.find({
      $or: [{ user_1: userId }, { user_2: userId }],
    }).populate('user_1 user_2 card_offered_by_user_1 card_offered_by_user_2');

    res.status(200).json(matches);
  } catch (error) {
    console.error('Erreur lors de la récupération des matchs:', error);
    res
      .status(500)
      .json({ message: 'Erreur serveur lors de la récupération des matchs.' });
  }
};

module.exports = {
  createMatch,
  getMatchesForCurrentUser,
};
