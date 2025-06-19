const { logError } = require('../logger');
const Card = require('../models/Card');

// 🔸 helper : même filtre partout
const tradeableFilter = {
  $or: [{ tradeable: true }, { rarity: { $lte: 5 } }],
};

// ────────────────────────────────────────────────────────────
// GET /api/cards             (toutes les cartes échangeables)
// ────────────────────────────────────────────────────────────
const getAllCards = async (req, res) => {
  try {
    /** On ne récupère que les cartes échangeables */
    const cards = await Card.find(tradeableFilter);

    // Regrouper par set_code
    const grouped = cards.reduce((acc, card) => {
      (acc[card.set_code] ??= []).push(card);
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

// ────────────────────────────────────────────────────────────
// GET /api/cards/:set_code   (uniquement échangeables du set)
// ────────────────────────────────────────────────────────────
const getCardsBySet = async (req, res) => {
  const { set_code } = req.params;
  try {
    const cards = await Card.find({
      set_code,
      ...tradeableFilter,
    }).sort({ official_id: 1 });

    return res.status(200).json(cards);
  } catch (err) {
    logError('Erreur lors du getCardsBySet', err);
    return res
      .status(500)
      .json({ error: 'Erreur lors de la récupération des cartes' });
  }
};

// ────────────────────────────────────────────────────────────
// GET /api/card/:id          (carte individuelle)
// ────────────────────────────────────────────────────────────
const getCardById = async (req, res) => {
  const { id } = req.params;
  try {
    const card = await Card.findOne({
      official_id: id,
      ...tradeableFilter,
    });

    if (!card)
      return res
        .status(404)
        .json({ message: 'Carte non trouvée ou non-échangeable' });

    return res.status(200).json(card);
  } catch (err) {
    logError('Erreur lors du getCardById', err);
    return res
      .status(500)
      .json({ error: 'Erreur lors de la récupération de la carte' });
  }
};

module.exports = {
  getAllCards,
  getCardsBySet,
  getCardById,
};
