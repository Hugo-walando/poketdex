const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connecté à MongoDB Atlas');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB Atlas:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
