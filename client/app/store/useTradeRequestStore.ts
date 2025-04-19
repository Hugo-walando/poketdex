// app/store/useTradeRequestStore.ts
import { create } from 'zustand';
import { TradeGroup } from '@/app/types';

interface TradeRequestStore {
  tradeGroups: TradeGroup[];
  setTradeGroups: (groups: TradeGroup[]) => void;
  resetTradeGroups: () => void;
}

export const useTradeRequestStore = create<TradeRequestStore>((set) => ({
  tradeGroups: [],
  setTradeGroups: (groups) => set({ tradeGroups: groups }),
  resetTradeGroups: () => set({ tradeGroups: [] }),
}));
