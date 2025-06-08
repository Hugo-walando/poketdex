import { useEffect, useState } from 'react';
import axiosClient from '@/lib/axios';
import { useUserStore } from '@/app/store/useUserStore';
import toast from 'react-hot-toast';
import { ListedCard } from '@/app/types';
import axios from 'axios';

const useFetchListedCards = () => {
  const user = useUserStore((state) => state.user);
  const [listedCards, setListedCards] = useState<ListedCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.accessToken) return;

    const fetchListedCards = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosClient.get<ListedCard[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/listed-cards/me`,
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          },
        );
        setListedCards(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          // Ne pas afficher de toast si erreur 401 (déjà gérée globalement)
          if (err.response?.status === 401) return;

          const message =
            err.response?.data?.message ||
            'Erreur lors du chargement des cartes listées';
          setError(message);
          toast.error(message);
        } else {
          setError('Erreur inconnue');
          toast.error('Erreur inconnue');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchListedCards();
  }, [user?.accessToken]);

  return { listedCards, loading, error };
};

export default useFetchListedCards;
