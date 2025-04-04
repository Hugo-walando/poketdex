const Set = require('../models/Set');

const setController = {
  // Créer un nouveau set
  createSet: async (req, res) => {
    try {
      const { name, color, img_url } = req.body;
      const newSet = new Set({
        name,
        color,
        img_url,
      });
      const savedSet = await newSet.save();
      res.status(201).json(savedSet);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Récupérer tous les sets
  getAllSets: async (req, res) => {
    try {
      const sets = await Set.find();
      res.status(200).json(sets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Récupérer un set par son ID
  getSetById: async (req, res) => {
    try {
      const set = await Set.findById(req.params.id);
      if (!set) return res.status(404).json({ message: 'Set non trouvé' });
      res.status(200).json(set);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Mettre à jour un set
  updateSet: async (req, res) => {
    try {
      const updatedSet = await Set.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedSet) return res.status(404).json({ message: 'Set non trouvé' });
      res.status(200).json(updatedSet);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Supprimer un set
  deleteSet: async (req, res) => {
    try {
      const deletedSet = await Set.findByIdAndDelete(req.params.id);
      if (!deletedSet) return res.status(404).json({ message: 'Set non trouvé' });
      res.status(200).json({ message: 'Set supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = setController;
