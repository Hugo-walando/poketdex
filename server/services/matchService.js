// /server/services/matchService.js (version optimisée complète)

const ListedCard = require('../models/ListedCard');
const WishlistCard = require('../models/WishlistCard');
const Match = require('../models/Match');

function isValidTrade(cardA, cardB) {
  return cardA && cardB && cardA.rarity === cardB.rarity;
}

async function findAndCreateMatch(userId, cardId, mode = 'listed') {
  try {
    console.log('🔧 Recherche de match optimisée pour:', userId, mode);

    if (mode === 'listed') {
      const listedCard = await ListedCard.findOne({
        user: userId,
        card: cardId,
      }).populate('card');
      if (!listedCard) return;

      const matchedWishlists = await WishlistCard.find({
        card: cardId,
        user: { $ne: userId },
      })
        .populate('user')
        .lean();

      const otherUserIds = [
        ...new Set(matchedWishlists.map((w) => w.user._id.toString())),
      ];
      const otherUserListedCards = await ListedCard.find({
        user: { $in: otherUserIds },
      })
        .populate('card')
        .lean();

      const currentUserWishlist = await WishlistCard.find({
        user: userId,
      }).lean();
      const currentWishlistSet = new Set(
        currentUserWishlist.map((w) => w.card.toString()),
      );

      const groupedByUser = new Map();
      for (const card of otherUserListedCards) {
        const uid = card.user.toString();
        if (!groupedByUser.has(uid)) groupedByUser.set(uid, []);
        groupedByUser.get(uid).push(card);
      }

      for (const wishlistEntry of matchedWishlists) {
        const otherUserId = wishlistEntry.user._id.toString();
        const theirCards = groupedByUser.get(otherUserId) || [];

        for (const theirCard of theirCards) {
          if (!currentWishlistSet.has(theirCard.card._id.toString())) continue;
          if (!isValidTrade(listedCard.card, theirCard.card)) continue;

          const alreadyExists = await Match.findOne({
            $or: [
              {
                user_1: userId,
                user_2: otherUserId,
                card_offered_by_user_1: listedCard.card._id,
                card_offered_by_user_2: theirCard.card._id,
              },
              {
                user_1: otherUserId,
                user_2: userId,
                card_offered_by_user_1: theirCard.card._id,
                card_offered_by_user_2: listedCard.card._id,
              },
            ],
          });

          if (!alreadyExists) {
            await Match.create({
              user_1: userId,
              user_2: otherUserId,
              card_offered_by_user_1: listedCard.card._id,
              card_offered_by_user_2: theirCard.card._id,
              status: 'pending',
            });
            console.log(`✅ Nouveau match créé avec ${otherUserId}`);
          }
        }
      }
    } else if (mode === 'wishlist') {
      const wishlistCard = await WishlistCard.findOne({
        user: userId,
        card: cardId,
      }).populate('card');
      if (!wishlistCard) return;

      const matchingListedCards = await ListedCard.find({
        card: cardId,
        user: { $ne: userId },
      })
        .populate('user')
        .populate('card')
        .lean();

      const otherUserIds = [
        ...new Set(matchingListedCards.map((c) => c.user._id.toString())),
      ];
      const otherUsersWishlistCards = await WishlistCard.find({
        user: { $in: otherUserIds },
      })
        .populate('card')
        .lean();

      const currentUserListedCards = await ListedCard.find({ user: userId })
        .populate('card')
        .lean();
      const currentListedSet = new Set(
        currentUserListedCards.map((c) => c.card._id.toString()),
      );

      const groupedByUser = new Map();
      for (const card of otherUsersWishlistCards) {
        const uid = card.user.toString();
        if (!groupedByUser.has(uid)) groupedByUser.set(uid, []);
        groupedByUser.get(uid).push(card);
      }

      for (const listedCard of matchingListedCards) {
        const otherUserId = listedCard.user._id.toString();
        const theirWishes = groupedByUser.get(otherUserId) || [];

        for (const theirWish of theirWishes) {
          if (!currentListedSet.has(theirWish.card._id.toString())) continue;
          if (!isValidTrade(wishlistCard.card, theirWish.card)) continue;

          const alreadyExists = await Match.findOne({
            $or: [
              {
                user_1: userId,
                user_2: otherUserId,
                card_offered_by_user_1: theirWish.card._id,
                card_offered_by_user_2: listedCard.card._id,
              },
              {
                user_1: otherUserId,
                user_2: userId,
                card_offered_by_user_1: listedCard.card._id,
                card_offered_by_user_2: theirWish.card._id,
              },
            ],
          });

          if (!alreadyExists) {
            await Match.create({
              user_1: userId,
              user_2: otherUserId,
              card_offered_by_user_1: theirWish.card._id,
              card_offered_by_user_2: listedCard.card._id,
              status: 'pending',
            });
            console.log(`✅ Nouveau match créé avec ${otherUserId}`);
          }
        }
      }
    }
  } catch (err) {
    console.error('❌ Erreur dans matchService optimisé :', err);
  }
}

module.exports = { findAndCreateMatch };
