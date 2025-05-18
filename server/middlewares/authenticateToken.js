const axios = require('axios');
const Account = require('../models/Account');
const User = require('../models/User');
const { logError } = require('../logger');

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // format "Bearer <token>"

  if (!token) {
    console.warn(
      `❗ Aucun token fourni - requête ${req.method} ${req.originalUrl}`,
    );

    return res.status(401).json({ message: 'Token manquant' });
  }

  try {
    // Étape 1 : Vérifier le token Google
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`,
    );

    const decoded = response.data;

    // Étape 2 : Trouver le compte lié à ce sub (Google ID)
    const account = await Account.findOne({
      provider: 'google',
      providerAccountId: decoded.sub,
    });

    if (!account) {
      console.warn(`❌ Aucun compte lié au sub: ${decoded.sub}`);
      return res.status(401).json({ message: 'Compte non reconnu' });
    }

    // Étape 3 : Récupérer le user Mongo lié
    const user = await User.findById(account.userId);

    if (!user) {
      console.warn(`❌ Utilisateur non trouvé pour userId: ${account.userId}`);

      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Étape 4 : Injecter le user complet dans la requête
    req.user = user;
    req.googleSub = decoded.sub;

    next();
  } catch (err) {
    logError(
      'Erreur lors de la vérification du token ou de la récupération de l’utilisateur',
      err,
    );
    return res
      .status(401)
      .json({ message: 'Token invalide ou erreur serveur' });
  }
}

module.exports = { authenticateToken };
