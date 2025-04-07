const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('❌ JWT_SECRET manquant dans les variables d’environnement');
}

function authenticateToken(req, res, next) {
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

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('❌ Token invalide ou expiré');
      return res.status(403).json({ message: 'Token invalide' });
    }

    console.log('✅ Token valide, payload décodé :', decoded);

    req.user = decoded; // ex: { id: '...', email: '...' }
    next();
  });
}

module.exports = { authenticateToken };
