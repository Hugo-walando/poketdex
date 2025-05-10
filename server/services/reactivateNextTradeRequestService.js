const TradeRequest = require('../models/TradeRequest');

async function reactivateNextTradeRequest(senderId, receiverId) {
  // On cherche les tradeRequests entre les deux users qui sont inactives
  const nextTrade = await TradeRequest.findOne({
    $or: [
      { sender: senderId, receiver: receiverId },
      { sender: receiverId, receiver: senderId },
    ],
    is_active: false,
    status: 'pending', // on réactive seulement les demandes en attente
  }).sort({ createdAt: -1 }); // la plus récente d'abord

  if (nextTrade) {
    nextTrade.is_active = true;
    await nextTrade.save();
    console.log(
      '✅ Nouvelle TradeRequest activée automatiquement :',
      nextTrade._id,
    );
    return nextTrade;
  }
  return null;
}

module.exports = reactivateNextTradeRequest;
