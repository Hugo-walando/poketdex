const Set = require('../models/Set');

// controllers/setController.ts
const getAllSets = async (req, res) => {
  try {
    const sets = await Set.find(); // Mongoose
    res.status(200).json(sets);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des sets' });
  }
};

module.exports = {
  getAllSets,
};
