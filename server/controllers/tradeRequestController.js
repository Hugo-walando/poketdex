const TradeRequest = require('../models/TradeRequest');
const Match = require('../models/Match');

// POST /api/trade-requests
const createTradeRequest = async (req, res) => {
  try {
    const { matchId } = req.body;
    const senderId = req.user._id; // On récupère l'id du joueur connecté
    console.log('User connecté :', req.user);
    console.log('ID de l’utilisateur connecté :', senderId);

    if (!matchId) {
      return res.status(400).json({ message: 'ID du match manquant.' });
    }

    // On récupère le match
    const match = await Match.findById(matchId).populate(
      'user_1 user_2 card_offered_by_user_1 card_offered_by_user_2',
    );

    if (!match) {
      return res.status(404).json({ message: 'Match non trouvé.' });
    }

    // Vérifier que l'utilisateur connecté est bien un des deux joueurs
    if (
      !match.user_1._id.equals(senderId) &&
      !match.user_2._id.equals(senderId)
    ) {
      return res
        .status(403)
        .json({ message: 'Non autorisé à envoyer une demande pour ce match.' });
    }

    // Définir qui envoie / qui reçoit + les cartes
    const isSenderUser1 = match.user_1._id.equals(senderId);

    const receiverId = isSenderUser1 ? match.user_2._id : match.user_1._id;
    const cardOffered = isSenderUser1
      ? match.card_offered_by_user_1._id
      : match.card_offered_by_user_2._id;
    const cardRequested = isSenderUser1
      ? match.card_offered_by_user_2._id
      : match.card_offered_by_user_1._id;

    // Vérifier qu'une TradeRequest identique n'existe pas déjà
    const existingRequest = await TradeRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      card_offered: cardOffered,
      card_requested: cardRequested,
      status: 'pending',
    });

    if (existingRequest) {
      return res
        .status(409)
        .json({ message: "Demande d'échange déjà envoyée." });
    }

    // Créer la demande
    const tradeRequest = await TradeRequest.create({
      sender: senderId,
      receiver: receiverId,
      card_offered: cardOffered,
      card_requested: cardRequested,
    });

    res.status(201).json(tradeRequest);
  } catch (err) {
    console.error("Erreur création demande d'échange :", err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const updateTradeRequest = async (req, res) => {
  try {
    const userId = req.user._id; // connecté
    const tradeRequestId = req.params.id;
    const { status } = req.body; // 'accepted' ou 'declined'
    console.log('Requête de mise à jour de TradeRequest');
    console.log('ID de l’utilisateur connecté :', userId);
    console.log('ID de la demande d’échange :', tradeRequestId);
    console.log('Statut de la demande d’échange :', status);

    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Statut invalide.' });
    }

    const tradeRequest = await TradeRequest.findById(tradeRequestId);

    if (!tradeRequest) {
      return res.status(404).json({ message: 'TradeRequest non trouvée.' });
    }

    // 👇 Vérifier que c'est bien le receiver qui agit
    if (String(tradeRequest.receiver) !== String(userId)) {
      return res.status(403).json({ message: 'Non autorisé.' });
    }

    tradeRequest.status = status;
    tradeRequest.is_active = false;

    await tradeRequest.save();

    res.status(200).json(tradeRequest);
  } catch (error) {
    console.error('Erreur updateTradeRequest:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  createTradeRequest,
  updateTradeRequest,
};
