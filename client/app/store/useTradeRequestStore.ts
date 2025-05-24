// app/store/useTradeRequestStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TradeGroup, TradeRequest } from '@/app/types';

interface TradeRequestStore {
  tradeGroups: TradeGroup[];
  setTradeGroups: (groups: TradeGroup[]) => void;
  resetTradeGroups: () => void;
  addTradeRequest: (newTrade: TradeRequest) => void;

  updateTradeStatus: (
    tradeId: string,
    newStatus: 'pending' | 'accepted' | 'declined' | 'cancelled' | 'completed',
  ) => void;
  markAsSent: (tradeId: string, currentUserId: string) => void;
  setTradeActive: (tradeId: string) => void;
  hasImportantTradeActivity: (currentUserId: string) => boolean;
  hasImportantTradeWithUser: (userId: string, currentUserId: string) => boolean;
  seenUsers: string[];
  markUserTradesAsSeen: (userId: string) => void;
}

export const useTradeRequestStore = create<TradeRequestStore>()(
  persist(
    (set, get) => ({
      seenUsers: [],
      tradeGroups: [],

      setTradeGroups: (groups) => set({ tradeGroups: groups }),

      resetTradeGroups: () => set({ tradeGroups: [] }),

      addTradeRequest: (newTrade) =>
        set((state) => {
          const existingGroupIndex = state.tradeGroups.findIndex(
            (group) =>
              group.user._id === newTrade.sender._id ||
              group.user._id === newTrade.receiver._id,
          );

          if (existingGroupIndex !== -1) {
            const updatedGroups = [...state.tradeGroups];
            updatedGroups[existingGroupIndex].trades.unshift(newTrade);
            return { tradeGroups: updatedGroups };
          } else {
            const newGroup = {
              user: newTrade.sender,
              trades: [newTrade],
            };
            return { tradeGroups: [newGroup, ...state.tradeGroups] };
          }
        }),

      updateTradeStatus: (tradeId, newStatus) =>
        set((state) => ({
          tradeGroups: state.tradeGroups.map((group) => ({
            ...group,
            trades: group.trades.map((trade) =>
              trade._id === tradeId
                ? {
                    ...trade,
                    status: newStatus,
                    is_active:
                      newStatus === 'pending' || newStatus === 'accepted',
                  }
                : trade,
            ),
          })),
        })),

      setTradeActive: (tradeId) =>
        set((state) => ({
          tradeGroups: state.tradeGroups.map((group) => ({
            ...group,
            trades: group.trades.map((trade) =>
              trade._id === tradeId ? { ...trade, is_active: true } : trade,
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

              if (
                updatedTrade.sent_by_sender &&
                updatedTrade.sent_by_receiver
              ) {
                updatedTrade.status = 'completed';
                updatedTrade.is_active = false;
              }

              return updatedTrade;
            }),
          })),
        })),

      hasImportantTradeActivity: (currentUserId) => {
        const { tradeGroups, seenUsers } = get();

        return tradeGroups.some((group) => {
          if (seenUsers.includes(group.user._id)) return false;

          return group.trades.some((t) => {
            const isReceivedRequest =
              t.receiver._id === currentUserId && t.status === 'pending';
            const isAcceptedSent =
              t.sender._id === currentUserId && t.status === 'accepted';
            const hasReceivedCard =
              t.receiver._id === currentUserId && t.sent_by_sender;
            return isReceivedRequest || isAcceptedSent || hasReceivedCard;
          });
        });
      },

      hasImportantTradeWithUser: (userId: string, currentUserId: string) => {
        const { tradeGroups, seenUsers } = get();
        if (seenUsers.includes(userId)) return false;

        return tradeGroups.some((group) => {
          if (group.user._id !== userId) return false;

          return group.trades.some((t) => {
            const isReceivedRequest =
              t.receiver._id === currentUserId && t.status === 'pending';
            const isAcceptedSent =
              t.sender._id === currentUserId && t.status === 'accepted';
            const hasReceivedCard =
              t.receiver._id === currentUserId && t.sent_by_sender;
            return isReceivedRequest || isAcceptedSent || hasReceivedCard;
          });
        });
      },

      markUserTradesAsSeen: (userId) =>
        set((state) => ({
          seenUsers: [...new Set([...state.seenUsers, userId])],
        })),
    }),
    {
      name: 'trade-requests-store',
      partialize: (state) => ({ seenUsers: state.seenUsers }),
    },
  ),
);
