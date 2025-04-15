import { create } from 'zustand';
import { ListedCard, WishlistCard } from '@/app/types';

interface CollectionState {
  listedCards: ListedCard[];
  wishlistCards: WishlistCard[];
  setListedCards: (cards: ListedCard[]) => void;
  setWishlistCards: (cards: WishlistCard[]) => void;
  addListedCardToStore: (card: ListedCard) => void;
  addWishlistCardToStore: (card: WishlistCard) => void;
  resetCollections: () => void;
}

export const useCollectionStore = create<CollectionState>((set) => ({
  listedCards: [],
  wishlistCards: [],
  setListedCards: (cards) => set({ listedCards: cards }),
  setWishlistCards: (cards) => set({ wishlistCards: cards }),
  addListedCardToStore: (card) =>
    set((state) => ({ listedCards: [...state.listedCards, card] })),
  addWishlistCardToStore: (card) =>
    set((state) => ({ wishlistCards: [...state.wishlistCards, card] })),
  resetCollections: () => set({ listedCards: [], wishlistCards: [] }),
}));
