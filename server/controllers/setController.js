const Set = require('../models/Set');

// controllers/setController.ts
const getAllCards = async (req, res) => {
  try {
    console.log('🃏 Fetching all cards (grouped by setCode)');

    const cards = await Card.find(); // Récupère toutes les cartes

    // Regroupe les cartes par setCode
    const grouped = cards.reduce((acc, card) => {
      const setCode = card.setCode;
      if (!acc[setCode]) acc[setCode] = [];
      acc[setCode].push(card);
      return acc;
    }, {});

    return res.status(200).json(grouped);
  } catch (err) {
    console.error('❌ Error fetching cards:', err);
    return res
      .status(500)
      .json({ error: 'Erreur lors de la récupération des cartes' });
  }
};

module.exports = {
  getAllSets,
};
