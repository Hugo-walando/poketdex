// stores/useGlobalData.ts
import { create } from 'zustand';
import { Card, Set } from '../types';

interface GlobalState {
  sets: Set[];
  cardsBySet: Record<string, Card[]>;
  hasFetchedSets: boolean;
  hasFetchedCards: boolean;
  setSets: (sets: Set[]) => void;
  setCardsBySet: (setCode: string, cards: Card[]) => void;
  markFetched: (key: 'sets' | 'cards') => void;
}

export const useGlobalData = create<GlobalState>((set) => ({
  sets: [],
  cardsBySet: {},
  hasFetchedSets: false,
  hasFetchedCards: false,
  setSets: (sets) => set({ sets }),
  setCardsBySet: (code, cards) =>
    set((state) => ({
      cardsBySet: { ...state.cardsBySet, [code]: cards },
    })),
  markFetched: (key) => {
    if (key === 'sets') set({ hasFetchedSets: true });
    if (key === 'cards') set({ hasFetchedCards: true });
  },
}));
