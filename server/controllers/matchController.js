const { logError } = require('../logger');
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
    logError('Erreur lors du createMatch', err);
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
    logError('Erreur lors du getMatchesForCurrentUser', err);
    res
      .status(500)
      .json({ message: 'Erreur serveur lors de la récupération des matchs.' });
  }
};

const getSimilarMatches = async (req, res) => {
  try {
    const { offeredCardId, requestedCardId } = req.query;
    const userId = req.user._id;

    if (!offeredCardId || !requestedCardId) {
      return res.status(400).json({ message: 'Paramètres manquants.' });
    }

    const matches = await Match.find({
      $or: [
        {
          card_offered_by_user_1: offeredCardId,
          card_offered_by_user_2: requestedCardId,
        },
        {
          card_offered_by_user_1: requestedCardId,
          card_offered_by_user_2: offeredCardId,
        },
      ],
      $and: [{ user_1: { $ne: userId } }, { user_2: { $ne: userId } }],
    }).populate('user_1 user_2 card_offered_by_user_1 card_offered_by_user_2');

    res.status(200).json(matches);
  } catch (error) {
    logError('Erreur lors du getSimilarMatches', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  createMatch,
  getMatchesForCurrentUser,
  getSimilarMatches,
};
