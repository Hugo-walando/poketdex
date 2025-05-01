import { create } from 'zustand';
import { ListedCard } from '@/app/types';

interface AllListedCardsState {
  allListedCards: ListedCard[];
  setAllListedCards: (cards: ListedCard[]) => void;
  resetAllListedCards: () => void;
  refetchListedCards?: () => void; // 🔄 nouvelle méthode
  setRefetchListedCards: (fn: () => void) => void;
}

export const useAllListedCardsStore = create<AllListedCardsState>((set) => ({
  allListedCards: [],
  setAllListedCards: (cards) => set({ allListedCards: cards }),
  resetAllListedCards: () => set({ allListedCards: [] }),
  setRefetchListedCards: (fn) => set({ refetchListedCards: fn }),
}));
