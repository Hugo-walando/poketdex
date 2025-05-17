const { logError } = require('../logger');
const Card = require('../models/Card');

// controllers/cardController.ts
const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find(); // Récupère toutes les cartes

    // Regroupe les cartes par setCode
    const grouped = cards.reduce((acc, card) => {
      const setCode = card.set_code;
      if (!acc[setCode]) acc[setCode] = [];
      acc[setCode].push(card);
      return acc;
    }, {});

    return res.status(200).json(grouped);
  } catch (err) {
    logError('Erreur lors du getAllCards', err);
    return res
      .status(500)
      .json({ error: 'Erreur lors de la récupération des cartes' });
  }
};

const getCardsBySet = async (req, res) => {
  const { set_code } = req.params;
  try {
    const cards = await Card.find({ set_code }).sort({
      official_id: 1,
    });
    res.status(200).json(cards);
  } catch (err) {
    logError('Erreur lors du getCardsBySet', err);
    res
      .status(500)
      .json({ error: 'Erreur lors de la récupération des cartes' });
  }
};
const getCardById = async (req, res) => {
  const { id } = req.params;
  try {
    const card = await Card.findOne({ official_id: id });
    if (!card) return res.status(404).json({ message: 'Carte non trouvée' });
    res.status(200).json(card);
  } catch (err) {
    logError('Erreur lors du getCardbyId', err);
    res
      .status(500)
      .json({ error: 'Erreur lors de la récupération de la carte' });
  }
};

module.exports = {
  getAllCards,
  getCardsBySet,
  getCardById,
};
