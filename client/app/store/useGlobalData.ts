// stores/useGlobalData.ts
import { create } from 'zustand';
import { Card, Set } from '../types';

interface GlobalState {
  sets: Set[];
  setSets: (sets: Set[]) => void;

  cardsBySet: Record<string, Card[]>;
  setAllCardsBySet: (cardsBySet: Record<string, Card[]>) => void;

  loadingSets: boolean;
  setLoadingSets: (loading: boolean) => void;

  loadingCards: boolean;
  setLoadingCards: (loading: boolean) => void;
}

export const useGlobalData = create<GlobalState>((set) => ({
  sets: [],
  cardsBySet: {},

  setSets: (sets) => set({ sets }),

  setAllCardsBySet: (cardsBySet) => set({ cardsBySet }),

  loadingSets: false,
  loadingCards: false,
  setLoadingSets: (loading) => set({ loadingSets: loading }),
  setLoadingCards: (loading) => set({ loadingCards: loading }),
}));
