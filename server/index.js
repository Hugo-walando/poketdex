const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

const connectDB = require('./config/db');
const { setupSocket, getConnectedUserIds } = require('./socket');

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    console.info(`[REQ] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Middlewares
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());

// DB connection
connectDB();

// Routes API
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/sets', require('./routes/setRoutes'));
app.use('/api/cards', require('./routes/cardRoutes'));
app.use('/api/listed-cards', require('./routes/listedCardRoutes'));
app.use('/api/wishlist-cards', require('./routes/wishlistCardRoutes'));
app.use('/api/matches', require('./routes/matchRoutes'));
app.use('/api/trade-requests', require('./routes/tradeRequestRoutes'));
app.use('/api/ping', require('./routes/pingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));

// Test route
app.get('/', (req, res) => {
  res.send('Backend Socket.IO prêt ✅');
});

app.get('/api/connected-users', (req, res) => {
  res.json({ connectedUserIds: getConnectedUserIds() });
});

// Server + Socket.IO
const server = http.createServer(app);
setupSocket(server, allowedOrigin);

server.listen(PORT, () =>
  console.log(`✅ Serveur avec Socket.IO lancé sur le port ${PORT}`),
);
