// stores/useGlobalData.ts
import { create } from 'zustand';
import { Card, Set } from '../types';

interface GlobalState {
  sets: Set[];
  setSets: (sets: Set[]) => void;
  cardsBySet: Record<string, Card[]>;
  setCardsBySet: (code: string, cards: Card[]) => void;
}

export const useGlobalData = create<GlobalState>((set) => ({
  sets: [],
  cardsBySet: {},
  setSets: (sets) => set({ sets }),
  setCardsBySet: (code, cards) =>
    set((state) => ({
      cardsBySet: { ...state.cardsBySet, [code]: cards },
    })),
}));
