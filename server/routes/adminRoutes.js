const express = require('express');
const router = express.Router();
const { getConnectedUserIds } = require('../socket');
const User = require('../models/User'); // ton modèle Mongoose
const TradeRequest = require('../models/TradeRequest');
const ListedCard = require('../models/ListedCard');
const WishlistCard = require('../models/WishlistCard');
const Card = require('../models/Card');

router.get('/connected-users', async (req, res) => {
  try {
    const userIds = getConnectedUserIds();

    const users = await User.find({ _id: { $in: userIds } }).select(
      'username profile_picture',
    ); // ou ce que tu veux afficher

    res.status(200).json(users);
  } catch (err) {
    console.error('Erreur récupération users connectés :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/completed-trades-count', async (req, res) => {
  try {
    const count = await TradeRequest.countDocuments({ status: 'completed' });
    res.status(200).json({ count });
  } catch (error) {
    console.error('Erreur lors du comptage des trades complétés:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    // 🔢 Utilisateurs
    const totalUsers = await User.countDocuments();
    const connectedUserIds = getConnectedUserIds();
    const connectedUsersCount = connectedUserIds.length;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: oneWeekAgo },
    });

    // 🔄 Échanges
    const totalTrades = await TradeRequest.countDocuments();
    const completedTrades = await TradeRequest.countDocuments({
      status: 'completed',
    });
    const activeTrades = await TradeRequest.countDocuments({
      status: 'active',
    });
    const cancelledTrades = await TradeRequest.countDocuments({
      status: 'cancelled',
    });

    // 📦 Cartes
    const listedCards = await ListedCard.countDocuments();
    const wishlistCards = await WishlistCard.countDocuments();

    const topWishlistRaw = await WishlistCard.aggregate([
      { $group: { _id: '$card', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const topListedRaw = await ListedCard.aggregate([
      { $group: { _id: '$card', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Puis tu récupères les cartes avec leurs infos
    const wishlistCardIds = topWishlistRaw.map((entry) => entry._id);
    const listedCardIds = topListedRaw.map((entry) => entry._id);

    const cardsWishlist = await Card.find({ _id: { $in: wishlistCardIds } });
    const cardsListed = await Card.find({ _id: { $in: listedCardIds } });

    // Combine aggregation + card data
    const topWishlist = topWishlistRaw.map((entry) => {
      const card = cardsWishlist.find(
        (c) => c._id.toString() === entry._id.toString(),
      );
      return {
        card_id: entry._id,
        count: entry.count,
        name: card?.name ?? 'Inconnu',
        img_url: card?.img_url ?? '',
        set_code: card?.set_code ?? '',
        official_id: card?.official_id ?? '',
      };
    });

    const topListed = topListedRaw.map((entry) => {
      const card = cardsListed.find(
        (c) => c._id.toString() === entry._id.toString(),
      );
      return {
        card_id: entry._id,
        count: entry.count,
        name: card?.name ?? 'Inconnu',
        img_url: card?.img_url ?? '',
        set_code: card?.set_code ?? '',
        official_id: card?.official_id ?? '',
      };
    });

    res.json({
      users: {
        total: totalUsers,
        connected: connectedUsersCount,
        recent: recentUsers,
      },
      trades: {
        total: totalTrades,
        completed: completedTrades,
        active: activeTrades,
        cancelled: cancelledTrades,
      },
      cards: {
        listed: listedCards,
        wishlist: wishlistCards,
        topWishlist,
        topListed,
      },
    });
  } catch (err) {
    console.error('❌ Erreur dans /admin/stats:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;

module.exports = router;
