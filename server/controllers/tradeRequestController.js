const TradeRequest = require('../models/TradeRequest');
const Match = require('../models/Match');

// POST /api/trade-requests
const createTradeRequest = async (req, res) => {
  try {
    console.log('🔧 Requête de création d’une demande d’échange');
    const { matchId } = req.body;
    const senderId = req.user._id; // User connecté

    if (!matchId) {
      return res.status(400).json({ message: 'ID du match manquant.' });
    }

    // ➔ Récupérer le match
    const match = await Match.findById(matchId).populate(
      'user_1 user_2 card_offered_by_user_1 card_offered_by_user_2',
    );

    if (!match) {
      return res.status(404).json({ message: 'Match non trouvé.' });
    }

    // ➔ Vérifier que l'utilisateur connecté participe bien au match
    if (
      !match.user_1._id.equals(senderId) &&
      !match.user_2._id.equals(senderId)
    ) {
      return res
        .status(403)
        .json({ message: 'Non autorisé à envoyer une demande pour ce match.' });
    }

    // ➔ Déterminer correctement sender et receiver
    const sender = match.user_1._id.equals(senderId)
      ? match.user_1
      : match.user_2;
    const receiver = match.user_1._id.equals(senderId)
      ? match.user_2
      : match.user_1;

    // ➔ Déterminer les cartes
    const offered_card = match.user_1._id.equals(senderId)
      ? match.card_offered_by_user_1
      : match.card_offered_by_user_2;
    const requested_card = match.user_1._id.equals(senderId)
      ? match.card_offered_by_user_2
      : match.card_offered_by_user_1;

    // ➔ Vérification doublon
    const existingTrade = await TradeRequest.findOne({
      sender: sender._id,
      receiver: receiver._id,
      card_offered: offered_card._id,
      card_requested: requested_card._id,
      status: { $in: ['pending', 'accepted'] }, // uniquement échanges actifs
    });

    if (existingTrade) {
      console.log('⚠️ Une demande d’échange similaire existe déjà.');
      return res
        .status(409)
        .json({ message: "Une demande d'échange similaire existe déjà." });
    }

    // ➔ Création de la TradeRequest
    const newTrade = await TradeRequest.create({
      sender: sender._id,
      receiver: receiver._id,
      card_offered: offered_card._id,
      card_requested: requested_card._id,
    });

    console.log('✅ Demande d’échange créée avec succès :', newTrade._id);

    // ➔ SUPPRIMER le match maintenant ✅
    await Match.deleteOne({ _id: matchId });
    console.log('🗑️ Match supprimé après création de la TradeRequest');

    res.status(201).json(newTrade);
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
    console.log('Status dans la requete :', status);

    if (!['accepted', 'declined'].includes(status)) {
      console.log('Statut invalide.');
      return res.status(400).json({ message: 'Statut invalide.' });
    }

    const tradeRequest = await TradeRequest.findById(tradeRequestId);

    if (!tradeRequest) {
      console.log('TradeRequest non trouvée.');
      return res.status(404).json({ message: 'TradeRequest non trouvée.' });
    }

    // 👇 Vérifier que c'est bien le receiver qui agit
    if (String(tradeRequest.receiver) !== String(userId)) {
      console.log('Trade Request receiver', tradeRequest.receiver);
      console.log('User connecté', userId);
      console.log('Non autorisé à mettre à jour cette demande.');
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

const getMyTradeRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const tradeRequests = await TradeRequest.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate('sender', 'username profile_picture friend_code')
      .populate('receiver', 'username profile_picture friend_code')
      .populate('card_offered')
      .populate('card_requested')
      .sort({ createdAt: -1 });

    res.status(200).json(tradeRequests);
  } catch (error) {
    console.error(
      '❌ Erreur lors de la récupération des TradeRequests :',
      error,
    );
    res
      .status(500)
      .json({ message: 'Erreur serveur lors de la récupération.' });
  }
};

const markTradeRequestAsSent = async (req, res) => {
  try {
    const tradeRequestId = req.params.id;
    const userId = req.user._id; // user connecté

    const trade = await TradeRequest.findById(tradeRequestId);

    if (!trade) {
      return res.status(404).json({ message: 'TradeRequest non trouvée.' });
    }

    // Vérifier si l'utilisateur est bien impliqué
    if (
      String(trade.sender) !== String(userId) &&
      String(trade.receiver) !== String(userId)
    ) {
      return res.status(403).json({ message: 'Non autorisé.' });
    }

    // Marquer l'envoi selon le rôle
    if (String(trade.sender) === String(userId)) {
      trade.sent_by_sender = true;
    } else if (String(trade.receiver) === String(userId)) {
      trade.sent_by_receiver = true;
    }

    // Si les deux ont envoyé → échange terminé
    if (trade.sent_by_sender && trade.sent_by_receiver) {
      trade.completed = true;
      trade.is_active = false;
    }

    await trade.save();

    res.status(200).json(trade);
  } catch (error) {
    console.error('Erreur markTradeRequestAsSent:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  createTradeRequest,
  updateTradeRequest,
  getMyTradeRequests,
  markTradeRequestAsSent,
};
