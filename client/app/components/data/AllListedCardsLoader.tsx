'use client';

import { useEffect } from 'react';
import { useAllListedCardsStore } from '@/app/store/useAllListedCardsStore';
import useFetchAllListedCards from '@/app/hooks/useFetchAllListedCards';

export default function AllListedCardsLoader() {
  const { setAllListedCards, setRefetchListedCards } = useAllListedCardsStore();
  const { listedCards, loading, refetch } = useFetchAllListedCards();

  useEffect(() => {
    if (!loading && listedCards.length > 0) {
      setAllListedCards(listedCards);
    }
  }, [loading, listedCards, setAllListedCards]);

  useEffect(() => {
    setRefetchListedCards(refetch);
  }, [refetch, setRefetchListedCards]);

  return null;
}
