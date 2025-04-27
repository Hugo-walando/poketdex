'use client';

import { useEffect } from 'react';
import { useAllListedCardsStore } from '@/app/store/useAllListedCardsStore';
import useFetchAllListedCards from '@/app/hooks/useFetchAllListedCards'; // Ton hook qu'on a fait ensemble

export default function AllListedCardsLoader() {
  const setAllListedCards = useAllListedCardsStore((s) => s.setAllListedCards);

  const { listedCards, loading } = useFetchAllListedCards();

  useEffect(() => {
    if (!loading && listedCards.length > 0) {
      console.log('📥 Stockage de toutes les listedCards...');
      setAllListedCards(listedCards);
    }
  }, [loading, listedCards, setAllListedCards]);

  return null;
}
