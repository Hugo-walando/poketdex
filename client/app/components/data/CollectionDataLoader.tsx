import { useEffect } from 'react';
import { useCollectionStore } from '@/app/store/useCollectionStore';
import useFetchListedCards from '@/app/hooks/useFetchListedCards';
import useFetchWishlistCards from '@/app/hooks/useFetchWishlistCards';

export default function CollectionLoader() {
  const setListedCards = useCollectionStore((s) => s.setListedCards);
  const setWishlistCards = useCollectionStore((s) => s.setWishlistCards);
  const setLoadingListedCards = useCollectionStore(
    (s) => s.setLoadingListedCards,
  );
  const setLoadingWishlistCards = useCollectionStore(
    (s) => s.setLoadingWishlistCards,
  );

  const { listedCards, loading: loadingListed } = useFetchListedCards();
  const { wishlistCards, loading: loadingWishlist } = useFetchWishlistCards();

  // met à jour le loading dans le store (même si les cartes n’ont pas encore été définies)
  useEffect(() => {
    setLoadingListedCards(loadingListed);
  }, [loadingListed, setLoadingListedCards]);

  useEffect(() => {
    setLoadingWishlistCards(loadingWishlist);
  }, [loadingWishlist, setLoadingWishlistCards]);

  useEffect(() => {
    if (!loadingListed && listedCards.length > 0) {
      setListedCards(listedCards);
    }
  }, [loadingListed, listedCards, setListedCards]);

  useEffect(() => {
    if (!loadingWishlist && wishlistCards.length > 0) {
      setWishlistCards(wishlistCards);
    }
  }, [loadingWishlist, wishlistCards, setWishlistCards]);

  return null;
}
