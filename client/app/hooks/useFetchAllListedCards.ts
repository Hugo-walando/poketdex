'use client';

import { useEffect, useState, useCallback } from 'react';
import axiosClient from '@/lib/axios';
import { ListedCard } from '@/app/types';
import toast from 'react-hot-toast';
import { useUserStore } from '@/app/store/useUserStore';

const useFetchAllListedCards = () => {
  const user = useUserStore((state) => state.user);
  const [listedCards, setListedCards] = useState<ListedCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllListedCards = useCallback(async () => {
    if (!user?.accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.get<ListedCard[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/listed-cards`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      );
      setListedCards(response.data);
    } catch (err) {
      console.error('❌ Error fetching all listed cards:', err);
      setError('Erreur lors du chargement des cartes listées.');
      toast.error('❌ Impossible de charger toutes les cartes listées.');
    } finally {
      setLoading(false);
    }
  }, [user?.accessToken]);

  useEffect(() => {
    fetchAllListedCards();
  }, [fetchAllListedCards]);

  return { listedCards, loading, error, refetch: fetchAllListedCards };
};

export default useFetchAllListedCards;
