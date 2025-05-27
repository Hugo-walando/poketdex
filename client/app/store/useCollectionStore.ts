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
  incrementListedCardQuantity: (cardId: string) => void;
  decrementListedCardQuantity: (cardId: string) => void;
  getQuantityByCardId: (cardId: string) => number;
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
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

  incrementListedCardQuantity: (cardId) =>
    set((state) => ({
      listedCards: state.listedCards.map((item) =>
        item.card._id === cardId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    })),

  decrementListedCardQuantity: (cardId) =>
    set((state) => ({
      listedCards: state.listedCards
        .map((item) =>
          item.card._id === cardId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    })),
  getQuantityByCardId: (cardId) =>
    get().listedCards.find((item) => item.card._id === cardId)?.quantity || 0,

  resetCollections: () => set({ listedCards: [], wishlistCards: [] }),
}));
