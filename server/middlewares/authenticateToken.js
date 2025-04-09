const axios = require('axios');

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  const token = authHeader?.split(' ')[1]; // format "Bearer <token>"

  console.log('\n🔐 Middleware authenticateToken');
  console.log('👉 Requête vers :', req.method, req.originalUrl);
  console.log('📥 Authorization Header:', authHeader);
  console.log('🧪 Token extrait:', token);

  if (!token) {
    console.warn('❗Aucun token fourni');
    return res.status(401).json({ message: 'Token manquant' });
  }

  try {
    // Vérification du token via l'API Google
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`,
    );
    const decoded = response.data;

    console.log('✅ Token valide, payload décodé :', decoded);

    // Ajoute les informations de l'utilisateur dans la requête
    req.user = decoded; // L'ID et l'email de l'utilisateur sont dans `decoded`
    // console.log(req);
    next();
  } catch (err) {
    console.error('❌ Token invalide ou expiré');
    return res.status(403).json({ message: 'Token invalide' });
  }
}

module.exports = { authenticateToken };
