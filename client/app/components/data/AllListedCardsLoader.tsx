// /components/data/AllListedCardsLoader.tsx
'use client';

import { useEffect } from 'react';
import { useAllListedCardsStore } from '@/app/store/useAllListedCardsStore';
import useFetchAllListedCards from '@/app/hooks/useFetchAllListedCards';

export default function AllListedCardsLoader() {
  const { setAllListedCards, setRefetchListedCards, setLoading } =
    useAllListedCardsStore();

  const { listedCards, loading, refetch } = useFetchAllListedCards();

  // 🔄 Synchronise loading avec le store Zustand
  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

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
