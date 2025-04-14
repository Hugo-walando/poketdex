// stores/useGlobalData.ts
import { create } from 'zustand';
import { Card, Set } from '../types';

interface GlobalState {
  sets: Set[];
  setSets: (sets: Set[]) => void;

  cardsBySet: Record<string, Card[]>;
  setAllCardsBySet: (cardsBySet: Record<string, Card[]>) => void;
}

export const useGlobalData = create<GlobalState>((set) => ({
  sets: [],
  cardsBySet: {},

  setSets: (sets) => set({ sets }),

  setAllCardsBySet: (cardsBySet) => set({ cardsBySet }),
}));
