const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const setRoutes = require('./routes/setRoutes');
app.use('/api/sets', setRoutes);

const boosterRoutes = require('./routes/boosterRoutes');
app.use('/api/boosters', boosterRoutes);


app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
