const ListedCard = require('../models/ListedCard');
const WishlistCard = require('../models/WishlistCard');
const Card = require('../models/Card');
const Match = require('../models/Match');

const { findAndCreateMatch } = require('../services/matchService');

// POST /api/listed-cards
const addListedCard = async (req, res) => {
  try {
    console.log('🔧 Requête d’ajout à la wishlist');
    console.log('USer', req.user);
    console.log('User ID:', req.user._id);
    const userId = req.user._id;
    const { cardId } = req.body;

    if (!req.user.username || !req.user.friend_code) {
      console.log(
        'Profil incomplet. Veuillez renseigner votre pseudo et votre code ami.',
      );
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
      console.log('🧹 Carte présente dans Wishlist → suppression');
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

    console.log('✅ Carte ajoutée à la liste');

    // 🧠 Lancer la recherche de match
    console.log(
      `🔍 Recherche de match pour l’utilisateur : ${userId} et la carte : ${cardId}`,
    );
    await findAndCreateMatch(userId, cardId, 'listed');

    await listed.populate('card');

    res.status(201).json(listed);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Carte déjà listée.' });
    }
    console.error('Erreur lors de l’ajout d’une carte listée :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// DELETE /api/listed-cards/:cardId
const removeListedCard = async (req, res) => {
  try {
    console.log('🔧 Requête de suppression de carte listée');
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

    console.log('✅ Carte listée supprimée');

    const deletedMatches = await Match.deleteMany({
      $or: [
        { user_1: userId, card_offered_by_user_1: cardId },
        { user_2: userId, card_offered_by_user_2: cardId },
      ],
    });

    console.log(
      `🗑️ ${deletedMatches.deletedCount} match(s) supprimé(s) car liés à cette carte et à cet utilisateur`,
    );

    res.status(204).end();
  } catch (err) {
    console.error('Erreur lors de la suppression de la carte listée :', err);
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
    console.error('Erreur lors de la récupération des cartes listées :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const getAllListedCards = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

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
    console.error('Erreur lors du filtrage par rareté wishlist :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  addListedCard,
  removeListedCard,
  getListedCards,
  getAllListedCards,
};
