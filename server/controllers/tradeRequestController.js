const TradeRequest = require('../models/TradeRequest');
const Match = require('../models/Match');
const reactivateNextTradeRequestService = require('../services/reactivateNextTradeRequestService');
const { getSocketIO, getConnectedUsersMap } = require('../socket');
const User = require('../models/User');
const { logError } = require('../logger');
const WishlistCard = require('../models/WishlistCard');
const ListedCard = require('../models/ListedCard');
const { Types } = require('mongoose');

// POST /api/trade-requests/quick
const createQuickTradeRequest = async (req, res) => {
  try {
    const { listedCardId, myCardOfferedId, toUserId } = req.body;
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
      .populate('sender', 'username profile_picture friend_code trade_count')
      .populate('receiver', 'username profile_picture friend_code trade_count');

    const io = getSocketIO();
    const connectedUsers = getConnectedUsersMap();
    const receiverSocketId = connectedUsers.get(toUserId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('new-trade-request', populatedTrade);
    }

    res.status(201).json(populatedTrade);
  } catch (error) {
    logError('Erreur lors du createQuickTradeRequest', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const updateTradeRequest = async (req, res) => {
  try {
    const userId = req.user._id; // connecté
    const tradeRequestId = req.params.id;
    const { status } = req.body; // 'accepted' ou 'declined'

    if (!['accepted', 'declined', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Statut invalide.' });
    }

    const tradeRequest = await TradeRequest.findById(tradeRequestId);

    if (!tradeRequest) {
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
        return res.status(403).json({ message: 'Non autorisé.' });
      }
    } else {
      // Acceptation ou Refus : seulement le receiver peut
      if (String(tradeRequest.receiver) !== String(userId)) {
        return res.status(403).json({ message: 'Non autorisé.' });
      }
    }

    tradeRequest.status = status;

    if (['declined', 'cancelled'].includes(status)) {
      tradeRequest.is_active = false;
    }

    await tradeRequest.save();
    const io = getSocketIO();
    const connectedUsers = getConnectedUsersMap();

    const recipientId =
      String(tradeRequest.sender) === String(userId)
        ? tradeRequest.receiver
        : tradeRequest.sender;

    const recipientSocketId = connectedUsers.get(String(recipientId));

    if (recipientSocketId) {
      io.to(recipientSocketId).emit('trade-updated', {
        tradeId: tradeRequest._id,
        status: tradeRequest.status,
        is_active: tradeRequest.is_active,
      });
    }

    if (['declined', 'cancelled'].includes(status)) {
      const nextTrade = await reactivateNextTradeRequestService(
        tradeRequest.sender,
        tradeRequest.receiver,
      );

      // 👉 Si une nouvelle trade est activée, notifie les deux utilisateurs :
      if (nextTrade) {
        const populated = await TradeRequest.findById(nextTrade._id)
          .populate('card_offered')
          .populate('card_requested')
          .populate(
            'sender',
            'username profile_picture friend_code trade_count',
          )
          .populate(
            'receiver',
            'username profile_picture friend_code trade_count',
          );

        const io = getSocketIO();
        const connectedUsers = getConnectedUsersMap();

        const senderSocket = connectedUsers.get(String(populated.sender._id));
        const receiverSocket = connectedUsers.get(
          String(populated.receiver._id),
        );

        const payload = { tradeId: populated._id, is_active: true };

        if (senderSocket)
          io.to(senderSocket).emit('trade-reactivated', payload);
        if (receiverSocket)
          io.to(receiverSocket).emit('trade-reactivated', payload);
      }
    }

    res.status(200).json(tradeRequest);
  } catch (error) {
    logError('Erreur lors du updatetraderequest', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const getMyTradeRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const tradeRequests = await TradeRequest.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate('sender', 'username profile_picture friend_code trade_count')
      .populate('receiver', 'username profile_picture friend_code trade_count')
      .populate('card_offered')
      .populate('card_requested')
      .sort({ createdAt: -1 });

    res.status(200).json(tradeRequests);
  } catch (error) {
    logError('Erreur lors du getMyTradeRequests', err);
    res
      .status(500)
      .json({ message: 'Erreur serveur lors de la récupération.' });
  }
};

const markTradeRequestAsSent = async (req, res) => {
  try {
    const tradeRequestId = req.params.id;
    const userId = req.user._id;

    const trade = await TradeRequest.findById(tradeRequestId)
      .populate('sender', 'username profile_picture friend_code trade_count')
      .populate('receiver', 'username profile_picture friend_code trade_count')
      .populate('card_offered')
      .populate('card_requested');

    if (!trade) {
      return res.status(404).json({ message: 'TradeRequest non trouvée.' });
    }

    if (
      String(trade.sender._id) !== String(userId) &&
      String(trade.receiver._id) !== String(userId)
    ) {
      return res.status(403).json({ message: 'Non autorisé.' });
    }

    if (String(trade.sender._id) === String(userId)) {
      trade.sent_by_sender = true;
    } else {
      trade.sent_by_receiver = true;
    }

    let isCompleted = false;
    if (trade.sent_by_sender && trade.sent_by_receiver) {
      trade.status = 'completed';
      trade.completed = true;
      trade.is_active = false;
      isCompleted = true;

      const senderId = trade.sender._id;
      const receiverId = trade.receiver._id;
      const offeredCardId = trade.card_offered._id;
      const requestedCardId = trade.card_requested._id;

      // ❌ Supprimer la wishlistCard du receiver (car il reçoit la carte qu’il voulait)
      await WishlistCard.findOneAndDelete({
        user: receiverId,
        card: offeredCardId,
      });

      // ❌ Supprimer la wishlistCard du sender (car il reçoit aussi une carte qu’il voulait)
      await WishlistCard.findOneAndDelete({
        user: senderId,
        card: requestedCardId,
      });

      // 📦 Décrémenter ou supprimer la listedCard du sender (il a donné offeredCard)
      const senderListed = await ListedCard.findOne({
        user: senderId,
        card: offeredCardId,
      });

      if (senderListed) {
        if (senderListed.quantity > 1) {
          senderListed.quantity -= 1;
          await senderListed.save();
        } else {
          await ListedCard.deleteOne({ _id: senderListed._id });
          await Match.deleteMany({
            $or: [
              { user_1: senderId, card_offered_by_user_1: offeredCardId },
              { user_2: senderId, card_offered_by_user_2: offeredCardId },
            ],
          });
        }
      }

      // 📦 Décrémenter ou supprimer la listedCard du receiver (il a donné requestedCard)
      const receiverListed = await ListedCard.findOne({
        user: receiverId,
        card: requestedCardId,
      });

      if (receiverListed) {
        if (receiverListed.quantity > 1) {
          receiverListed.quantity -= 1;
          await receiverListed.save();
        } else {
          await ListedCard.deleteOne({ _id: receiverListed._id });
          await Match.deleteMany({
            $or: [
              { user_1: receiverId, card_offered_by_user_1: requestedCardId },
              { user_2: receiverId, card_offered_by_user_2: requestedCardId },
            ],
          });
        }
      }

      // 🔢 Incrémenter le trade_count
      await User.updateOne({ _id: senderId }, { $inc: { trade_count: 1 } });
      await User.updateOne({ _id: receiverId }, { $inc: { trade_count: 1 } });

      // 📡 Socket.io → Notifier les deux utilisateurs pour mettre à jour leur store
      const io = getSocketIO();
      const connectedUsers = getConnectedUsersMap();

      const payload = {
        tradeId: trade._id,
        removedWishlistCardIds: [
          offeredCardId.toString(),
          requestedCardId.toString(),
        ],
        updatedListedCardIds: [
          offeredCardId.toString(),
          requestedCardId.toString(),
        ],
      };

      const senderSocket = connectedUsers.get(String(senderId));
      const receiverSocket = connectedUsers.get(String(receiverId));

      if (senderSocket) io.to(senderSocket).emit('trade-completed', payload);
      if (receiverSocket)
        io.to(receiverSocket).emit('trade-completed', payload);

      // 🔁 Réactivation d’une autre trade inactive si existante
      const nextTrade = await reactivateNextTradeRequestService(
        senderId,
        receiverId,
      );

      if (nextTrade) {
        const populated = await TradeRequest.findById(nextTrade._id)
          .populate('card_offered')
          .populate('card_requested')
          .populate(
            'sender',
            'username profile_picture friend_code trade_count',
          )
          .populate(
            'receiver',
            'username profile_picture friend_code trade_count',
          );

        const reactivationPayload = { tradeId: populated._id };

        const nextSenderSocket = connectedUsers.get(
          String(populated.sender._id),
        );
        const nextReceiverSocket = connectedUsers.get(
          String(populated.receiver._id),
        );

        if (nextSenderSocket)
          io.to(nextSenderSocket).emit(
            'trade-reactivated',
            reactivationPayload,
          );
        if (nextReceiverSocket)
          io.to(nextReceiverSocket).emit(
            'trade-reactivated',
            reactivationPayload,
          );
      }
    }

    await trade.save();

    const io = getSocketIO();
    const connectedUsers = getConnectedUsersMap();

    const senderSocket = connectedUsers.get(String(trade.sender._id));
    const receiverSocket = connectedUsers.get(String(trade.receiver._id));

    const eventPayload = {
      tradeId: trade._id,
      sentByUserId: userId.toString(), // <- ID de celui qui vient d'envoyer
    };

    if (senderSocket)
      io.to(senderSocket).emit('trade-sent-update', eventPayload);
    if (receiverSocket)
      io.to(receiverSocket).emit('trade-sent-update', eventPayload);

    // 🔄 Réactivation possible d’une autre TradeRequest

    // 📡 Notifier les deux utilisateurs
    res.status(200).json(trade);
  } catch (error) {
    logError('Erreur lors du markTradeRequestAsSent', error);
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
    logError('Erreur lors du createMultipleTradeRequests', err);
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
