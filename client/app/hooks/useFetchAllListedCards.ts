import { useEffect, useCallback } from 'react';
import axiosClient from '@/lib/axios';
import toast from 'react-hot-toast';
import { useUserStore } from '@/app/store/useUserStore';
import { useAllListedCardsStore } from '@/app/store/useAllListedCardsStore';

const useFetchAllListedCards = () => {
  const user = useUserStore((state) => state.user);
  const {
    pagination: { page },
    setPagination,
    setAllListedCards,
    setLoading,
    searchQuery,
    selectedSets,
    selectedRarities,
  } = useAllListedCardsStore();

  const {
    allListedCards,
    loading,
    pagination: { totalPages, setPage },
  } = useAllListedCardsStore();

  const limit = 30;

  const fetchListedCards = useCallback(async () => {
    if (!user?.accessToken) return;

    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (searchQuery) params.append('search', searchQuery);
      if (selectedSets.length) params.append('sets', selectedSets.join(','));
      if (selectedRarities.length)
        params.append('rarities', selectedRarities.join(','));

      const response = await axiosClient.get(`/api/listed-cards?${params}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      setAllListedCards(response.data.data);
      setPagination({
        page: response.data.page,
        totalPages: response.data.pages,
        setPage,
      });
    } catch (err) {
      console.error('❌ Error fetching listed cards:', err);
      toast.error('❌ Impossible de charger les cartes listées.');
    } finally {
      setLoading(false);
    }
  }, [
    user?.accessToken,
    page,
    searchQuery,
    selectedSets,
    selectedRarities,
    setLoading,
    setAllListedCards,
    setPagination,
    setPage,
  ]);

  useEffect(() => {
    fetchListedCards();
  }, [fetchListedCards]);

  return {
    listedCards: allListedCards,
    loading,
    page,
    totalPages,
    setPage,
    refetch: fetchListedCards,
  };
};

export default useFetchAllListedCards;
