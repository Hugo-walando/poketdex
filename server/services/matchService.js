// /server/services/matchService.js

const ListedCard = require('../models/ListedCard');
const WishlistCard = require('../models/WishlistCard');
const Match = require('../models/Match');
const User = require('../models/User');

async function isValidTrade(user1Card, user2Card) {
  return user1Card && user2Card && user1Card.rarity === user2Card.rarity;
}

async function findAndCreateMatch(userId, cardId) {
  try {
    const currentUserCard = await ListedCard.findOne({
      user: userId,
      card: cardId,
    }).populate('card');

    if (!currentUserCard) return;

    const potentialMatches = await WishlistCard.find({
      card: cardId,
      user: { $ne: userId },
    }).populate({
      path: 'user',
      select: '_id username profile_picture',
    });

    for (const wishlistEntry of potentialMatches) {
      const otherUserId = wishlistEntry.user._id;

      const otherUserCards = await ListedCard.find({
        user: otherUserId,
      }).populate('card');

      for (const theirCard of otherUserCards) {
        const userWantsTheirCard = await WishlistCard.findOne({
          user: userId,
          card: theirCard.card._id,
        });

        if (!userWantsTheirCard) continue;

        const sameRarity = await isValidTrade(
          currentUserCard.card,
          theirCard.card,
        );

        if (sameRarity) {
          console.log(
            `✅ Matchpotential : ${currentUserCard.card.name} et ${theirCard.card.name} ont la même rareté`,
          );
        }

        if (!sameRarity) {
          console.log(
            `❌ Pas de match : ${currentUserCard.card.name} et ${theirCard.card.name} n'ont pas la même rareté`,
          );
          continue;
        }

        const existingMatch = await Match.findOne({
          $or: [
            {
              user_1: userId,
              user_2: otherUserId,
              card_offered_by_user_1: currentUserCard.card._id,
              card_offered_by_user_2: theirCard.card._id,
            },
            {
              user_1: otherUserId,
              user_2: userId,
              card_offered_by_user_1: theirCard.card._id,
              card_offered_by_user_2: currentUserCard.card._id,
            },
          ],
        });

        if (!existingMatch) {
          await Match.create({
            user_1: userId,
            user_2: otherUserId,
            card_offered_by_user_1: currentUserCard.card._id,
            card_offered_by_user_2: theirCard.card._id,
            status: 'pending',
          });
          console.log(`✅ Match trouvé entre ${userId} et ${otherUserId}`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Erreur dans findAndCreateMatch:', error);
  }
}

module.exports = { findAndCreateMatch };
