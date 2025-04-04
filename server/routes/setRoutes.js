const express = require('express');
const router = express.Router();
const setController = require('../controllers/setController');

// Route pour créer un set
router.post('/', setController.createSet);

// Route pour récupérer tous les sets
router.get('/', setController.getAllSets);

// Route pour récupérer un set par ID
router.get('/:id', setController.getSetById);

// Route pour mettre à jour un set
router.put('/:id', setController.updateSet);

// Route pour supprimer un set
router.delete('/:id', setController.deleteSet);

module.exports = router;
