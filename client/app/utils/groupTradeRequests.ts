// app/utils/groupTradeRequests.ts
import { TradeRequest, TradeGroup } from '@/app/types';

export function groupTradeRequestsByUser(
  trades: TradeRequest[],
  currentUserId: string,
): TradeGroup[] {
  const groups: Record<string, TradeGroup> = {};

  for (const trade of trades) {
    const otherUser =
      trade.sender._id === currentUserId ? trade.receiver : trade.sender;

    if (!groups[otherUser._id]) {
      groups[otherUser._id] = {
        user: {
          _id: otherUser._id,
          username: otherUser.username,
          profile_picture:
            otherUser.profile_picture || '/testimgs/avatars/Av1.png',
          friend_code: otherUser.friend_code,
        },
        trades: [],
      };
    }

    groups[otherUser._id].trades.push(trade);
  }

  return Object.values(groups);
}
