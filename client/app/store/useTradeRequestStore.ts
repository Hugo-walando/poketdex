import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TradeGroup, TradeRequest } from '@/app/types';

type TradeStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'cancelled'
  | 'completed';

interface TradeRequestStore {
  tradeGroups: TradeGroup[];
  setTradeGroups: (groups: TradeGroup[]) => void;
  resetTradeGroups: () => void;
  addTradeRequest: (newTrade: TradeRequest) => void;

  updateTradeStatus: (tradeId: string, newStatus: TradeStatus) => void;
  toggleMarkAsSent: (tradeId: string, currentUserId: string) => void;
  setTradeActive: (tradeId: string) => void;
  hasImportantTradeActivity: (currentUserId: string) => boolean;
  hasImportantTradeWithUser: (userId: string, currentUserId: string) => boolean;
  seenTradeStatuses: Record<string, TradeStatus>;
  markTradeStatusAsSeen: (tradeId: string, status: TradeStatus) => void;
}

export const useTradeRequestStore = create<TradeRequestStore>()(
  persist(
    (set, get) => ({
      seenTradeStatuses: {},
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

      toggleMarkAsSent: (tradeId: string, currentUserId: string) =>
        set((state) => ({
          tradeGroups: state.tradeGroups.map((group) => ({
            ...group,
            trades: group.trades.map((trade) => {
              if (trade._id !== tradeId) return trade;

              const isSender = trade.sender._id === currentUserId;

              const updatedTrade = { ...trade };

              if (isSender) {
                updatedTrade.sent_by_sender = !trade.sent_by_sender;
              } else {
                updatedTrade.sent_by_receiver = !trade.sent_by_receiver;
              }

              // Vérifie si les deux ont marqué comme envoyé
              if (
                updatedTrade.sent_by_sender &&
                updatedTrade.sent_by_receiver
              ) {
                updatedTrade.status = 'completed';
                updatedTrade.is_active = false;
              } else {
                // Si un des deux annule, on repasse à "accepted" (ou autre si besoin)
                if (trade.status === 'completed') {
                  updatedTrade.status = 'accepted';
                  updatedTrade.is_active = true;
                }
              }

              return updatedTrade;
            }),
          })),
        })),

      hasImportantTradeActivity: (currentUserId) => {
        const { tradeGroups, seenTradeStatuses } = get();

        return tradeGroups.some((group) =>
          group.trades.some((t) => {
            const isRelevant =
              (t.receiver._id === currentUserId && t.status === 'pending') ||
              (t.sender._id === currentUserId && t.status === 'accepted') ||
              (t.receiver._id === currentUserId && t.sent_by_sender);

            return isRelevant && seenTradeStatuses[t._id] !== t.status;
          }),
        );
      },

      hasImportantTradeWithUser: (userId, currentUserId) => {
        const { tradeGroups, seenTradeStatuses } = get();

        return tradeGroups.some((group) => {
          if (group.user._id !== userId) return false;

          return group.trades.some((t) => {
            const isRelevant =
              (t.receiver._id === currentUserId && t.status === 'pending') ||
              (t.sender._id === currentUserId && t.status === 'accepted') ||
              (t.receiver._id === currentUserId && t.sent_by_sender);

            return isRelevant && seenTradeStatuses[t._id] !== t.status;
          });
        });
      },

      markTradeStatusAsSeen: (tradeId, status) =>
        set((state) => ({
          seenTradeStatuses: {
            ...state.seenTradeStatuses,
            [tradeId]: status,
          },
        })),
    }),
    {
      name: 'trade-requests-store',
      partialize: (state) => ({ seenTradeStatuses: state.seenTradeStatuses }),
    },
  ),
);
