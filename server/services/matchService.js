const Match = require('../models/Match');
const ListedCard = require('../models/ListedCard');
const WishlistCard = require('../models/WishlistCard');

/**
 * Fonction pour chercher un match potentiel et le créer si trouvé
 */
async function findAndCreateMatch(userId, cardId, mode) {
  // userId → L'utilisateur qui vient d'ajouter une carte
  // cardId → La carte qu'il a ajoutée
  // mode → 'wishlist' ou 'listed'

  try {
    console.log(
      `🔎 Recherche de match pour user=${userId}, card=${cardId}, mode=${mode}`,
    );

    if (mode === 'wishlist') {
      // L'utilisateur a ajouté une carte dans sa wishlist
      // On cherche un utilisateur qui a cette carte dans ses listedCards (doublons)
      const listedCard = await ListedCard.findOne({
        card: cardId,
        user: { $ne: userId }, // pas lui-même !
      });

      if (!listedCard) {
        console.log('😕 Aucun utilisateur ne possède cette carte en doublon');
        return;
      }

      console.log('✅ Carte trouvée chez un autre utilisateur pour échange');

      // Créer un match
      await Match.create({
        user_1: userId,
        user_2: listedCard.user,
        card_offered_by_user_1: null, // il n'offre rien encore
        card_offered_by_user_2: cardId, // l'autre a cette carte
        status: 'pending',
      });
    } else if (mode === 'listed') {
      // L'utilisateur a ajouté une carte dans ses doublons
      // On cherche un utilisateur qui cherche cette carte dans sa wishlist
      const wishlistCard = await WishlistCard.findOne({
        card: cardId,
        user: { $ne: userId },
      });

      if (!wishlistCard) {
        console.log('😕 Aucun utilisateur ne cherche cette carte');
        return;
      }

      console.log('✅ Un utilisateur cherche cette carte');

      // Créer un match
      await Match.create({
        user_1: userId,
        user_2: wishlistCard.user,
        card_offered_by_user_1: cardId, // lui possède cette carte
        card_offered_by_user_2: null, // l'autre n'offre rien
        status: 'pending',
      });
    } else {
      console.error('❌ Mode inconnu pour la recherche de match');
      return;
    }

    // (Recherche + création du match ici)
  } catch (error) {
    console.error('❌ Erreur dans findAndCreateMatch:', error);
  }
}

module.exports = { findAndCreateMatch };
