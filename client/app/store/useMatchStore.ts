import { create } from 'zustand';
import { MatchGroup } from '@/app/types';

interface MatchStore {
  matchGroups: MatchGroup[];
  setMatches: (matches: MatchGroup[]) => void;
}

export const useMatchStore = create<MatchStore>((set) => ({
  matchGroups: [],
  setMatches: (matches) => set({ matchGroups: matches }),
}));
