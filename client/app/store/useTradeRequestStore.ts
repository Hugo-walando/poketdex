import { create } from 'zustand';
import { TradeGroup } from '@/app/types';

interface TradeRequestStore {
  tradeGroups: TradeGroup[];
  setTradeGroups: (groups: TradeGroup[]) => void;
  resetTradeGroups: () => void;
  updateTradeStatus: (
    tradeId: string,
    newStatus: 'pending' | 'accepted' | 'declined' | 'cancelled',
  ) => void;
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
}));
