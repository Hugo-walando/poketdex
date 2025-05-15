import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserStore } from '../store/useUserStore';
import toast from 'react-hot-toast';
import { Card } from '@/app/types';

export default function useFetchAllCards() {
  const user = useUserStore((state) => state.user);
  const [cardsBySet, setCardsBySet] = useState<Record<string, Card[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchCards = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cards`,
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          },
        );

        setCardsBySet(res.data);
      } catch (err) {
        console.error('❌ Error fetching all cards:', err);
        toast.error('Erreur lors de la récupération des cartes');
        setError('Erreur lors de la récupération des cartes');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [user]);

  return { cardsBySet, loading, error };
}
