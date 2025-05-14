import { useEffect, useState, useCallback } from 'react';
import axiosClient from '@/lib/axios';
import { useUserStore } from '@/app/store/useUserStore';
import toast from 'react-hot-toast';
import { ListedCard } from '@/app/types';

const useFetchListedCards = () => {
  const user = useUserStore((state) => state.user);
  const [listedCards, setListedCards] = useState<ListedCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 30;

  const fetchListedCards = useCallback(async () => {
    if (!user?.accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/listed-cards?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      );

      setListedCards(response.data.data);
      setTotalPages(response.data.pages);
    } catch (err) {
      console.error('❌ Error fetching listed cards:', err);
      setError('Erreur lors du chargement des cartes listées.');
      toast.error('❌ Impossible de charger les cartes listées.');
    } finally {
      setLoading(false);
    }
  }, [user?.accessToken, page]);

  // Re-fetch automatique quand `page` ou `accessToken` change
  useEffect(() => {
    fetchListedCards();
  }, [fetchListedCards]);

  return {
    listedCards,
    loading,
    error,
    page,
    totalPages,
    setPage,
    refetch: fetchListedCards, // 🔁 export refetch
  };
};

export default useFetchListedCards;
