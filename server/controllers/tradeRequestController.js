const TradeRequest = require('../models/TradeRequest');
const Match = require('../models/Match');
const reactivateNextTradeRequestService = require('../services/reactivateNextTradeRequestService');

// POST /api/trade-requests/quick
const createQuickTradeRequest = async (req, res) => {
  try {
    const { listedCardId, myCardOfferedId, toUserId } = req.body;
    console.log('Requête de création d’un quick trade');
    console.log('ID de la carte listée :', listedCardId);
    console.log('ID de la carte offerte :', myCardOfferedId);
    console.log('ID de l’utilisateur à qui envoyer la demande :', toUserId);
    const userId = req.user._id;
    const sender = req.user;

    if (!sender.username || !sender.friend_code) {
      return res.status(400).json({
        message:
          'Vous devez compléter votre profil (pseudo et code ami) pour envoyer une demande.',
      });
    }

    if (!listedCardId || !myCardOfferedId || !toUserId) {
      return res.status(400).json({ message: 'Données manquantes.' });
    }

    if (String(userId) === String(toUserId)) {
      return res.status(400).json({
        message: 'Vous ne pouvez pas vous envoyer un échange à vous-même.',
      });
    }

    // Check doublon
    const existing = await TradeRequest.findOne({
      sender: userId,
      receiver: toUserId,
      card_offered: myCardOfferedId,
      card_requested: listedCardId,
      status: { $in: ['pending', 'accepted'] },
    });

    if (existing) {
      return res
        .status(409)
        .json({ message: 'Une demande similaire existe déjà.' });
    }

    const alreadyActive = await TradeRequest.findOne({
      $or: [
        { sender: userId, receiver: toUserId },
        { sender: toUserId, receiver: userId },
      ],
      is_active: true,
    });

    const isActive = !alreadyActive;

    console.log('Card offerte :', myCardOfferedId);

    const newTrade = await TradeRequest.create({
      sender: userId,
      receiver: toUserId,
      card_offered: myCardOfferedId,
      card_requested: listedCardId,
      is_active: isActive,
    });

    const populatedTrade = await TradeRequest.findById(newTrade._id)
      .populate('card_offered')
      .populate('card_requested')
      .populate('sender', 'username profile_picture friend_code')
      .populate('receiver', 'username profile_picture friend_code');

    console.log('TradeRequest créée :', populatedTrade);

    res.status(201).json(populatedTrade);
  } catch (error) {
    console.error('❌ Erreur création quick trade :', error);
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

    if (!['accepted', 'declined', 'cancelled'].includes(status)) {
      console.log('Statut invalide.');
      return res.status(400).json({ message: 'Statut invalide.' });
    }

    const tradeRequest = await TradeRequest.findById(tradeRequestId);

    if (!tradeRequest) {
      console.log('TradeRequest non trouvée.');
      return res.status(404).json({ message: 'TradeRequest non trouvée.' });
    }

    if (!tradeRequest.is_active) {
      return res.status(403).json({
        message: "Impossible de modifier une demande d'échange inactive.",
      });
    }

    // 👇 Vérifier que c'est bien le receiver qui agit
    if (status === 'cancelled') {
      // Annulation : sender OU receiver a le droit
      if (
        String(tradeRequest.receiver) !== String(userId) &&
        String(tradeRequest.sender) !== String(userId)
      ) {
        console.log('Non autorisé à annuler cette demande.');
        return res.status(403).json({ message: 'Non autorisé.' });
      }
    } else {
      // Acceptation ou Refus : seulement le receiver peut
      if (String(tradeRequest.receiver) !== String(userId)) {
        console.log('Non autorisé à mettre à jour cette demande.');
        return res.status(403).json({ message: 'Non autorisé.' });
      }
    }

    tradeRequest.status = status;

    if (['declined', 'cancelled'].includes(status)) {
      tradeRequest.is_active = false;
    }

    await tradeRequest.save();
    if (['declined', 'cancelled'].includes(status)) {
      reactivateNextTradeRequestService(
        tradeRequest.sender,
        tradeRequest.receiver,
      );
    }

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
      console.log('Echange terminé !');
      trade.status = 'completed';
      trade.completed = true;
      trade.is_active = false;
    }

    await trade.save();

    if (trade.status === 'completed') {
      await reactivateNextTradeRequestService(trade.sender, trade.receiver);
    }
    res.status(200).json(trade);
  } catch (error) {
    console.error('Erreur markTradeRequestAsSent:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const createMultipleTradeRequests = async (req, res) => {
  try {
    const { matchIds } = req.body;
    const senderId = req.user._id;

    if (!Array.isArray(matchIds) || matchIds.length === 0) {
      return res.status(400).json({ message: 'Aucun match fourni.' });
    }

    const trades = [];

    for (const matchId of matchIds) {
      const match = await Match.findById(matchId).populate(
        'user_1 user_2 card_offered_by_user_1 card_offered_by_user_2',
      );

      if (!match) {
        return res.status(404).json({ message: 'Match non trouvé.' });
        continue;
      }

      const sender = match.user_1._id.equals(senderId)
        ? match.user_1
        : match.user_2;
      const receiver = match.user_1._id.equals(senderId)
        ? match.user_2
        : match.user_1;

      const offered_card = match.user_1._id.equals(senderId)
        ? match.card_offered_by_user_1
        : match.card_offered_by_user_2;

      const requested_card = match.user_1._id.equals(senderId)
        ? match.card_offered_by_user_2
        : match.card_offered_by_user_1;

      const existing = await TradeRequest.findOne({
        sender: sender._id,
        receiver: receiver._id,
        card_offered: offered_card._id,
        card_requested: requested_card._id,
        status: { $in: ['pending', 'accepted'] },
      });

      if (existing) continue;

      const alreadyActive = await TradeRequest.findOne({
        $or: [
          { sender: sender._id, receiver: receiver._id },
          { sender: receiver._id, receiver: sender._id },
        ],
        is_active: true,
      });

      const isActive = !alreadyActive;

      const newTrade = await TradeRequest.create({
        sender: sender._id,
        receiver: receiver._id,
        card_offered: offered_card._id,
        card_requested: requested_card._id,
        is_active: isActive,
      });

      await Match.deleteOne({ _id: matchId });
      trades.push(newTrade);
    }

    res.status(201).json(trades);
  } catch (err) {
    console.error('Erreur création multiple TradeRequests :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  createQuickTradeRequest,
  updateTradeRequest,
  getMyTradeRequests,
  markTradeRequestAsSent,
  createMultipleTradeRequests,
};
