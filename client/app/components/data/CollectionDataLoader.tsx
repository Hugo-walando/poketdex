'use client';

import { useEffect } from 'react';
import { useCollectionStore } from '@/app/store/useCollectionStore';
import useFetchListedCards from '@/app/hooks/useFetchListedCards';
import useFetchWishlistCards from '@/app/hooks/useFetchWishlistCards';

export default function CollectionLoader() {
  const setListedCards = useCollectionStore((s) => s.setListedCards);
  const setWishlistCards = useCollectionStore((s) => s.setWishlistCards);

  const { listedCards, loading: loadingListed } = useFetchListedCards();
  const { wishlistCards, loading: loadingWishlist } = useFetchWishlistCards();

  useEffect(() => {
    if (!loadingListed && listedCards.length > 0) {
      console.log('📥 Storing listed cards...');
      setListedCards(listedCards);
    }
  }, [loadingListed, listedCards, setListedCards]);

  useEffect(() => {
    if (!loadingWishlist && wishlistCards.length > 0) {
      console.log('📥 Storing wishlist cards...');
      setWishlistCards(wishlistCards);
    }
  }, [loadingWishlist, wishlistCards, setWishlistCards]);

  return null;
}
