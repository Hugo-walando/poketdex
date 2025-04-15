// store/useCollectionStore.ts
import { create } from 'zustand';
import { ListedCard, WishlistCard } from '@/app/types';

interface CollectionState {
  listedCards: ListedCard[];
  wishlistCards: WishlistCard[];
  setListedCards: (cards: ListedCard[]) => void;
  setWishlistCards: (cards: WishlistCard[]) => void;
  resetCollections: () => void;
}

export const useCollectionStore = create<CollectionState>((set) => ({
  listedCards: [],
  wishlistCards: [],

  setListedCards: (cards) => set({ listedCards: cards }),
  setWishlistCards: (cards) => set({ wishlistCards: cards }),
  resetCollections: () => set({ listedCards: [], wishlistCards: [] }),
}));
