// store/useCollectionStore.ts
import { create } from 'zustand';

interface CollectionState {
  listedCards: string[];
  wishlistCards: string[];
  toggleListedCard: (cardId: string) => void;
  toggleWishlistCard: (cardId: string) => void;
  setListedCards: (cards: string[]) => void;
  setWishlistCards: (cards: string[]) => void;
  resetCollections: () => void;
}

export const useCollectionStore = create<CollectionState>((set) => ({
  listedCards: [],
  wishlistCards: [],

  toggleListedCard: (cardId) =>
    set((state) => ({
      listedCards: state.listedCards.includes(cardId)
        ? state.listedCards.filter((id) => id !== cardId)
        : [...state.listedCards, cardId],
    })),

  toggleWishlistCard: (cardId) =>
    set((state) => ({
      wishlistCards: state.wishlistCards.includes(cardId)
        ? state.wishlistCards.filter((id) => id !== cardId)
        : [...state.wishlistCards, cardId],
    })),

  setListedCards: (cards) => set({ listedCards: cards }),
  setWishlistCards: (cards) => set({ wishlistCards: cards }),
  resetCollections: () => set({ listedCards: [], wishlistCards: [] }),
}));
