const express = require('express');
const cors = require('cors');
const http = require('http'); // 👈 Pour créer un serveur HTTP brut
const { Server } = require('socket.io');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Initialise Express
const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

// Création du serveur HTTP
app.use(cors({ origin: allowedOrigin, credentials: true }));
const server = http.createServer(app); // 👈 Important pour socket.io

// Création de l'instance socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Connexion MongoDB
connectDB();

// Middleware
app.use(express.json());
// app.use(errorHandler()); // Ajoute-le plus tard si tu veux

// Routes API REST
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/sets', require('./routes/setRoutes'));
app.use('/api/cards', require('./routes/cardRoutes'));
app.use('/api/listed-cards', require('./routes/listedCardRoutes'));
app.use('/api/wishlist-cards', require('./routes/wishlistCardRoutes'));
app.use('/api/matches', require('./routes/matchRoutes'));
app.use('/api/trade-requests', require('./routes/tradeRequestRoutes'));

// 📦 Ajoute les autres routes si besoin (boosters, notifications, etc.)

// Route test pour voir si le serveur répond
app.get('/', (req, res) => {
  res.send('Backend Socket.IO prêt ✅');
});

// 🎯 Gestion des connexions socket.io
io.on('connection', (socket) => {
  console.log('🟢 Nouveau client connecté :', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 Client déconnecté :', socket.id);
  });

  socket.on('hello', (message) => {
    console.log('📩 Message reçu du client :', message);
  });
});

// Lancer le serveur
server.listen(PORT, () =>
  console.log(`✅ Serveur avec Socket.IO lancé sur le port ${PORT}`),
);
