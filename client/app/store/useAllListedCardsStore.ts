// /store/useAllListedCardsStore.ts
import { create } from 'zustand';
import { ListedCard } from '@/app/types';

interface AllListedCardsState {
  allListedCards: ListedCard[];
  loading: boolean;
  setAllListedCards: (cards: ListedCard[]) => void;
  setLoading: (loading: boolean) => void;
  refetchListedCards?: () => void;
  setRefetchListedCards: (fn: () => void) => void;
  pagination: {
    page: number;
    totalPages: number;
    setPage: (page: number) => void;
  };
  setPagination: (data: {
    page: number;
    totalPages: number;
    setPage: (page: number) => void;
  }) => void;
}

export const useAllListedCardsStore = create<AllListedCardsState>((set) => ({
  allListedCards: [],
  loading: true,
  setAllListedCards: (cards) => set({ allListedCards: cards }),
  setLoading: (loading) => set({ loading }),
  setRefetchListedCards: (fn) => set({ refetchListedCards: fn }),
  pagination: {
    page: 1,
    totalPages: 1,
    setPage: () => {},
  },
  setPagination: ({ page, totalPages, setPage }) =>
    set((state) => ({
      pagination: {
        ...state.pagination,
        page,
        totalPages,
        setPage,
      },
    })),
}));
