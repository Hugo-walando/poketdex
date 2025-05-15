'use client';

import { useEffect } from 'react';
import { useAllListedCardsStore } from '@/app/store/useAllListedCardsStore';
import useFetchAllListedCards from '@/app/hooks/useFetchAllListedCards';

export default function AllListedCardsLoader() {
  const {
    setAllListedCards,
    setRefetchListedCards,
    setLoading,
    setPagination,
  } = useAllListedCardsStore();

  const { listedCards, loading, refetch, page, totalPages, setPage } =
    useFetchAllListedCards();

  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

  useEffect(() => {
    if (!loading) {
      setAllListedCards(listedCards);
      setPagination({ page, totalPages, setPage });
    }
  }, [
    listedCards,
    loading,
    page,
    totalPages,
    setAllListedCards,
    setPagination,
    setPage,
  ]);

  useEffect(() => {
    setRefetchListedCards(refetch);
  }, [refetch, setRefetchListedCards]);

  return null;
}
