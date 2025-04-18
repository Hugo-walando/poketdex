// /server/services/matchService.js

const ListedCard = require('../models/ListedCard');
const WishlistCard = require('../models/WishlistCard');
const Match = require('../models/Match');
const User = require('../models/User');

async function findAndCreateMatch(userId) {
  console.log('\n🔍 Recherche de match pour l`utilisateur :', userId);

  try {
    const userListedCards = await ListedCard.find({ user: userId }).populate(
      'card',
    );
    const userWishlistCards = await WishlistCard.find({
      user: userId,
    }).populate('card');

    if (userListedCards.length === 0 && userWishlistCards.length === 0) {
      console.log(
        '⛔ Aucun listedCard ou wishlistCard, pas de match possible.',
      );
      return;
    }

    const otherUsers = await User.find({ _id: { $ne: userId } });

    for (const otherUser of otherUsers) {
      const otherListedCards = await ListedCard.find({
        user: otherUser._id,
      }).populate('card');
      const otherWishlistCards = await WishlistCard.find({
        user: otherUser._id,
      }).populate('card');

      const userCardWantedByOther = userListedCards.find((listed) =>
        otherWishlistCards.some(
          (wishlist) => String(wishlist.card._id) === String(listed.card._id),
        ),
      );

      const otherCardWantedByUser = otherListedCards.find((listed) =>
        userWishlistCards.some(
          (wishlist) => String(wishlist.card._id) === String(listed.card._id),
        ),
      );

      if (userCardWantedByOther && otherCardWantedByUser) {
        console.log(`✅ Match trouvé entre ${userId} et ${otherUser._id}`);

        const existingMatch = await Match.findOne({
          $or: [
            {
              user_1: userId,
              user_2: otherUser._id,
              card_offered_by_user_1: userCardWantedByOther.card._id,
              card_offered_by_user_2: otherCardWantedByUser.card._id,
            },
            {
              user_1: userId,
              user_2: otherUser._id,
              card_offered_by_user_1: userCardWantedByOther.card._id,
              card_offered_by_user_2: otherCardWantedByUser.card._id,
            },
          ],
        });

        if (existingMatch) {
          console.log('⚠️ Match déjà existant, création annulée');
          return; // ❌ on arrête ici, pas besoin de créer
        }

        await Match.create({
          user_1: userId,
          user_2: otherUser._id,
          card_offered_by_user_1: userCardWantedByOther.card._id,
          card_offered_by_user_2: otherCardWantedByUser.card._id,
          status: 'pending',
        });
      } else {
        console.log(`⛔ Pas de match avec ${otherUser._id}`);
      }
    }
  } catch (error) {
    console.error('❌ Erreur dans findAndCreateMatch:', error);
  }
}

module.exports = { findAndCreateMatch };
