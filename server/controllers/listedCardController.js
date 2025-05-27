const ListedCard = require('../models/ListedCard');
const WishlistCard = require('../models/WishlistCard');
const Card = require('../models/Card');
const Match = require('../models/Match');

const { findAndCreateMatch } = require('../services/matchService');
const { logError } = require('../logger');

// POST /api/listed-cards
const addListedCard = async (req, res) => {
  try {
    const userId = req.user._id;
    const { cardId } = req.body;

    if (!req.user.username || !req.user.friend_code) {
      return res.status(400).json({
        message:
          'Profil incomplet. Veuillez renseigner votre pseudo et votre code ami.',
      });
    }

    // ⚡ Étape 1 : vérifier si la carte est déjà dans Wishlist
    const wishlistCard = await WishlistCard.findOne({
      user: userId,
      card: cardId,
    });

    if (wishlistCard) {
      await WishlistCard.findOneAndDelete({ user: userId, card: cardId });
    }

    // ⚡ Étape 2 : vérifier si elle est déjà listée
    const listedExists = await ListedCard.findOne({
      user: userId,
      card: cardId,
    });
    if (listedExists) {
      return res
        .status(409)
        .json({ message: 'Carte déjà présente dans la liste.' });
    }

    // ⚡ Étape 3 : ajouter dans Listed
    const listed = await ListedCard.create({
      user: userId,
      card: cardId,
    });

    // 🧠 Lancer la recherche de match
    await findAndCreateMatch(userId, cardId, 'listed');

    await listed.populate('card');

    res.status(201).json(listed);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Carte déjà listée.' });
    }
    logError('Erreur lors du addListedCard', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// DELETE /api/listed-cards/:cardId
const removeListedCard = async (req, res) => {
  try {
    const userId = req.user._id;
    const cardId = req.params.cardId;

    const deleted = await ListedCard.findOneAndDelete({
      user: userId,
      card: cardId,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: 'Carte non trouvée dans les cartes listées.' });
    }

    const deletedMatches = await Match.deleteMany({
      $or: [
        { user_1: userId, card_offered_by_user_1: cardId },
        { user_2: userId, card_offered_by_user_2: cardId },
      ],
    });

    res.status(204).end();
  } catch (err) {
    logError('Erreur lors du removeListedCard', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// GET /api/listed-cards
const getListedCards = async (req, res) => {
  try {
    const userId = req.user._id;

    const listedCards = await ListedCard.find({ user: userId })
      .populate({
        path: 'card',
      })
      .populate({
        path: 'user',
        select: 'username profile_picture', // ✅ seulement les infos nécessaires
      });

    res.status(200).json(listedCards);
  } catch (err) {
    logError('Erreur lors du getListedCards', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const getAllListedCards = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;
    const search = req.query.search?.toLowerCase() || '';
    const sets = req.query.sets ? req.query.sets.split(',') : [];
    const rarities = req.query.rarities
      ? req.query.rarities.split(',').map(Number)
      : [];

    const pipeline = [
      {
        // Exclure les cartes de l'utilisateur connecté
        $match: {
          user: { $ne: userId },
        },
      },
      {
        // Joindre les données des cartes
        $lookup: {
          from: 'cards',
          localField: 'card',
          foreignField: '_id',
          as: 'cardData',
        },
      },
      {
        // Déstructurer le tableau cardData (1 seule carte)
        $unwind: '$cardData',
      },
      {
        $match: {
          ...(search && {
            $or: [
              { 'cardData.name': { $regex: search, $options: 'i' } },
              { 'cardData.official_id': { $regex: search, $options: 'i' } },
            ],
          }),
          ...(sets.length > 0 && { 'cardData.set_code': { $in: sets } }),
          ...(rarities.length > 0 && { 'cardData.rarity': { $in: rarities } }),
        },
      },
      {
        // Joindre les infos utilisateur
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userData',
        },
      },
      {
        $unwind: '$userData',
      },
      {
        // Joindre les wishlist_cards de l'utilisateur
        $lookup: {
          from: 'wishlistcards',
          localField: 'userData._id',
          foreignField: 'user',
          as: 'userWishlistCards',
        },
      },
      {
        // Joindre les infos des cartes de la wishlist
        $lookup: {
          from: 'cards',
          localField: 'userWishlistCards.card',
          foreignField: '_id',
          as: 'wishlistCardDetails',
        },
      },
      {
        // Filtrer uniquement les listedCards dont la rareté
        // est présente dans au moins une carte de la wishlist
        $match: {
          $expr: {
            $in: ['$cardData.rarity', '$wishlistCardDetails.rarity'],
          },
        },
      },
      {
        $sort: { createdAt: -1 }, // 🔽 du plus récent au plus ancien
      },

      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        // Optionnel : re-projeter proprement
        $project: {
          _id: 1,
          card: '$cardData',
          user: {
            _id: '$userData._id',
            username: '$userData.username',
            profile_picture: '$userData.profile_picture',
            friend_code: '$userData.friend_code',
            wishlist_cards: '$userWishlistCards',
          },
        },
      },
    ];

    const listedCards = await ListedCard.aggregate(pipeline);

    // ⚠️ Pour avoir `total`, il faut refaire le même pipeline sans skip/limit
    const countPipeline = [...pipeline];
    // Supprimer $skip et $limit de countPipeline
    const cleanedCountPipeline = countPipeline.filter(
      (stage) => !stage.$skip && !stage.$limit,
    );
    cleanedCountPipeline.push({ $count: 'total' });

    const countResult = await ListedCard.aggregate(cleanedCountPipeline);
    const total = countResult[0]?.total || 0;

    res.status(200).json({
      data: listedCards,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    logError('Erreur lors du getAllListedCards', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const incrementListedCard = async (req, res) => {
  try {
    const userId = req.user._id;
    const cardId = req.params.cardId;

    const updated = await ListedCard.findOneAndUpdate(
      { user: userId, card: cardId },
      { $inc: { quantity: 1 } },
      { new: true },
    ).populate('card');

    if (!updated) {
      return res.status(404).json({ message: 'Carte non trouvée.' });
    }

    res.status(200).json(updated);
  } catch (err) {
    logError('Erreur lors de incrementListedCard', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const decrementListedCard = async (req, res) => {
  try {
    const userId = req.user._id;
    const cardId = req.params.cardId;

    const existing = await ListedCard.findOne({ user: userId, card: cardId });

    if (!existing) {
      return res.status(404).json({ message: 'Carte non trouvée.' });
    }

    if (existing.quantity > 1) {
      existing.quantity -= 1;
      await existing.save();
      return res.status(200).json(existing);
    } else {
      await ListedCard.deleteOne({ user: userId, card: cardId });

      // Supprimer les matchs liés à cette carte
      await Match.deleteMany({
        $or: [
          { user_1: userId, card_offered_by_user_1: cardId },
          { user_2: userId, card_offered_by_user_2: cardId },
        ],
      });

      return res
        .status(200)
        .json({ message: 'Carte supprimée car quantité = 1' });
    }
  } catch (err) {
    logError('Erreur lors de decrementListedCard', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  addListedCard,
  removeListedCard,
  getListedCards,
  getAllListedCards,
  incrementListedCard,
  decrementListedCard,
};
