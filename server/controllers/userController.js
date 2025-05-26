const User = require('../models/User');
const Account = require('../models/Account'); // le modèle pour la collection "accounts"
const { logError } = require('../logger');

const getCurrentUser = async (req, res) => {
  try {
    const googleId = req.googleSub;

    // Étape 1 : retrouver le compte lié à ce Google ID
    const account = await Account.findOne({
      provider: 'google',
      providerAccountId: googleId,
    });

    if (!account) {
      return res.status(401).json({ message: 'Compte non reconnu' });
    }

    // Étape 2 : retrouver l'utilisateur via l'userId stocké dans l'account
    const user = await User.findById(account.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (err) {
    logError('Erreur lors du getCurrentUser', err);
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
  } catch (err) {
    logError('Erreur lors du getUserById', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Imports (si tu ne les as pas déjà)

const updateUser = async (req, res) => {
  const updates = req.body;

  try {
    // Étape 1 : retrouver le compte "Google" lié au token
    const account = await Account.findOne({
      provider: 'google',
      providerAccountId: req.googleSub, // sub = ID Google unique
    });

    if (!account) {
      logError(`Aucun compte Google lié (googleSub: ${req.googleSub})`);
      return res
        .status(401)
        .json({ message: '❌ Aucun compte Google lié à cet utilisateur' });
    }

    // Étape 2 : retrouver l'utilisateur principal via userId (dans la collection "users")
    const currentUser = await User.findById(account.userId);

    if (!currentUser) {
      logError(
        `Utilisateur introuvable via l'userId de l'account (userId: ${account.userId})`,
      );
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (updates.username) {
      updates.username = updates.username.trim(); // supprime les espaces
      const existingUser = await User.findOne({
        username: updates.username,
        _id: { $ne: currentUser._id }, // exclure soi-même
      });

      if (existingUser) {
        return res.status(409).json({
          message: 'Ce pseudo est déjà utilisé par un autre joueur.',
        });
      }
    }
    if (updates.friend_code) {
      const clean = updates.friend_code.replace(/\D/g, '');
      const formatted = clean.replace(/(.{4})/g, '$1-').replace(/-$/, '');
      updates.friend_code = formatted;

      const existingFriendCode = await User.findOne({
        friend_code: formatted,
        _id: { $ne: currentUser._id }, // exclure soi-même
      });

      if (existingFriendCode) {
        return res.status(409).json({
          message: 'Ce code ami est déjà utilisé par un autre joueur.',
        });
      }
    }

    if (
      updates.profile_picture &&
      !updates.profile_picture.startsWith('/avatars/')
    ) {
      return res.status(400).json({ message: 'Image invalide.' });
    }
    // Étape 3 : faire la mise à jour
    const updatedUser = await User.findByIdAndUpdate(currentUser._id, updates, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(updatedUser);
  } catch (err) {
    logError('Erreur lors du updateUser', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getCurrentUser,
  getUserById,
  updateUser,
};
