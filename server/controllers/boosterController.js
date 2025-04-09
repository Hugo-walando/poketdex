const Booster = require('../models/Booster');
const Set = require('../models/Set');

const boosterController = {
  createBooster: async (req, res) => {
    try {
      const { set, name } = req.body;
      
      // Vérifier si le Set existe
      const existingSet = await Set.findById(set);
      if (!existingSet) return res.status(404).json({ message: "Set introuvable" });

      const newBooster = new Booster({ set, name });
      const savedBooster = await newBooster.save();
      res.status(201).json(savedBooster);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getBoostersBySet: async (req, res) => {
    try {
      const boosters = await Booster.find({ set: req.params.setId }).populate('set');
      res.json(boosters);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = boosterController;
