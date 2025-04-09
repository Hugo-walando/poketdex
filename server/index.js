const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

app.use(
  cors({
    origin: allowedOrigin, // Remplace par l'URL de ton frontend
    credentials: true, // Permet d'envoyer des cookies et des en-têtes d'autorisation
  }),
);
app.use(express.json());
// app.use(errorHandler());

// Connect to database
connectDB();

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const setRoutes = require('./routes/setRoutes');
app.use('/api/sets', setRoutes);
// const setRoutes = require('./routes/setRoutes');
const errorHandler = require('./middlewares/errorHandler');
// app.use('/api/sets', setRoutes);

const boosterRoutes = require('./routes/boosterRoutes');
app.use('/api/boosters', boosterRoutes);

const cardRoutes = require('./routes/cardRoutes');
app.use('/api/cards', cardRoutes);

const cardBoosterRoutes = require('./routes/cardBoosterRoutes');
app.use('/api/card-booster', cardBoosterRoutes);

const wishlistRoutes = require('./routes/wishlistRoutes');
app.use('/api/wishlist', wishlistRoutes);

const tradeRequestRoutes = require('./routes/tradeRequestRoutes');
app.use('/api/trade-requests', tradeRequestRoutes);

const duplicatesRoutes = require('./routes/duplicatesRoutes');
app.use('/api/duplicates', duplicatesRoutes);

const matchRoutes = require('./routes/matchRoutes');
app.use('/api/matches', matchRoutes);

const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);

app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
