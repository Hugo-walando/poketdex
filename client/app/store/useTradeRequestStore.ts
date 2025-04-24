// app/store/useTradeRequestStore.ts

import { create } from 'zustand';
import { TradeGroup } from '@/app/types';

interface TradeRequestStore {
  tradeGroups: TradeGroup[];
  setTradeGroups: (groups: TradeGroup[]) => void;
  resetTradeGroups: () => void;
  updateTradeStatus: (
    tradeId: string,
    newStatus: 'pending' | 'accepted' | 'declined' | 'cancelled' | 'completed',
  ) => void;
  markAsSent: (tradeId: string, currentUserId: string) => void;
}

export const useTradeRequestStore = create<TradeRequestStore>((set) => ({
  tradeGroups: [],

  setTradeGroups: (groups) => set({ tradeGroups: groups }),

  resetTradeGroups: () => set({ tradeGroups: [] }),

  updateTradeStatus: (tradeId, newStatus) =>
    set((state) => ({
      tradeGroups: state.tradeGroups.map((group) => ({
        ...group,
        trades: group.trades.map((trade) =>
          trade._id === tradeId
            ? {
                ...trade,
                status: newStatus,
                is_active: newStatus === 'pending' || newStatus === 'accepted',
              }
            : trade,
        ),
      })),
    })),

  markAsSent: (tradeId, currentUserId) =>
    set((state) => ({
      tradeGroups: state.tradeGroups.map((group) => ({
        ...group,
        trades: group.trades.map((trade) => {
          if (trade._id !== tradeId) return trade;

          const isSender = trade.sender._id === currentUserId;

          const updatedTrade = {
            ...trade,
            sent_by_sender: isSender ? true : trade.sent_by_sender,
            sent_by_receiver: !isSender ? true : trade.sent_by_receiver,
          };

          // 🟢 Si les deux ont envoyé leur carte => on marque completed
          if (updatedTrade.sent_by_sender && updatedTrade.sent_by_receiver) {
            updatedTrade.status = 'completed';
            updatedTrade.is_active = false; // Optionnel, tu peux désactiver l'échange aussi
          }

          return updatedTrade;
        }),
      })),
    })),
}));
