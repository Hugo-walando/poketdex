import { useEffect, useState } from 'react';
import axiosClient from '@/lib/axios';
import { useUserStore } from '@/app/store/useUserStore';
import toast from 'react-hot-toast';
import { ListedCard } from '@/app/types';

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
          `${process.env.NEXT_PUBLIC_API_URL}/api/listed-cards`,
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          },
        );
        setListedCards(response.data);
      } catch (err) {
        if (err) {
          console.error('❌ Error fetching listed cards:', err);
        }
        setError('Erreur lors du chargement des cartes listées.');
        toast.error('❌ Impossible de charger les cartes listées.');
      } finally {
        setLoading(false);
      }
    };

    fetchListedCards();
  }, [user?.accessToken]);

  return { listedCards, loading, error };
};

export default useFetchListedCards;
