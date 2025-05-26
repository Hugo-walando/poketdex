import { create } from 'zustand';
import { ListedCard, WishlistCard } from '@/app/types';

interface CollectionState {
  listedCards: ListedCard[];
  wishlistCards: WishlistCard[];
  setListedCards: (cards: ListedCard[]) => void;
  setWishlistCards: (cards: WishlistCard[]) => void;
  addListedCardToStore: (card: ListedCard) => void;
  addWishlistCardToStore: (card: WishlistCard) => void;
  removeListedCardFromStore: (cardId: string) => void;
  removeWishlistCardFromStore: (cardId: string) => void;
  removeListedCardByOfficialId: (officialId: string) => void;
  removeWishlistCardByOfficialId: (officialId: string) => void;
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

  removeListedCardFromStore: (cardId) =>
    set((state) => ({
      listedCards: state.listedCards.filter((item) => item.card._id !== cardId),
    })),
  removeWishlistCardFromStore: (cardId) =>
    set((state) => ({
      wishlistCards: state.wishlistCards.filter(
        (item) => item.card._id !== cardId,
      ),
    })),

  removeListedCardByOfficialId: (officialId) =>
    set((state) => ({
      listedCards: state.listedCards.filter(
        (item) => item.card.official_id !== officialId,
      ),
    })),
  removeWishlistCardByOfficialId: (officialId) =>
    set((state) => ({
      wishlistCards: state.wishlistCards.filter(
        (item) => item.card.official_id !== officialId,
      ),
    })),

  resetCollections: () => set({ listedCards: [], wishlistCards: [] }),
}));
