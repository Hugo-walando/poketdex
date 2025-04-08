const User = require('../models/User');
const Account = require('../models/Account'); // le modèle pour la collection "accounts"

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id; // ajouté par le middleware
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur /me :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur récupération utilisateur par ID :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Imports (si tu ne les as pas déjà)

const updateUser = async (req, res) => {
  const updates = req.body;

  console.log('🔧 Requête de mise à jour utilisateur');
  console.log('Payload token Google (req.user):', req.user);

  if (!updates.email) {
    return res
      .status(400)
      .json({ message: "L'email est requis pour la mise à jour" });
  }

  try {
    // Étape 1 : retrouver le compte "Google" lié au token
    const account = await Account.findOne({
      provider: 'google',
      providerAccountId: req.user.sub, // sub = ID Google unique
    });

    if (!account) {
      console.warn('❌ Aucun compte Google lié à cet utilisateur');
      return res
        .status(401)
        .json({ message: 'Utilisateur non reconnu (pas de compte lié)' });
    }

    // Étape 2 : retrouver l'utilisateur principal via userId (dans la collection "users")
    const currentUser = await User.findById(account.userId);

    if (!currentUser) {
      console.warn("❌ Utilisateur introuvable via l'userId de l'account");
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Étape 3 : faire la mise à jour
    const updatedUser = await User.findByIdAndUpdate(currentUser._id, updates, {
      new: true,
      runValidators: true,
    });

    console.log('✅ Utilisateur mis à jour avec succès :', updatedUser);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('[updateUser error]', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  updateUser,
};

module.exports = {
  getCurrentUser,
  getUserById,
  updateUser,
};
