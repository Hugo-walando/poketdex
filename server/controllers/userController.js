const User = require('../models/User');

const User = require('../models/User');

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id; // ajouté par le middleware
    const user = await User.findById(userId).select('-password'); // pas besoin du password

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur /me :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getCurrentUser,
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select('-password'); // on ne renvoie pas le mot de passe

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur récupération utilisateur par ID :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = userController;
