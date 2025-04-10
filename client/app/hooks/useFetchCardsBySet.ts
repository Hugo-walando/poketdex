import { useEffect, useState } from 'react';
import axiosClient from '@/lib/axios';
import { Card, Set } from '@/app/types';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

type CardsBySet = Record<string, Card[]>;

const useFetchCardsBySets = (sets: Set[]) => {
  const { data: session } = useSession();

  const [cardsBySet, setCardsBySet] = useState<CardsBySet>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      if (!session?.accessToken) {
        setError('Utilisateur non authentifié');
        toast.error('Utilisateur non authentifié');
        return;
      }

      setLoading(true);
      const result: CardsBySet = {};

      try {
        await Promise.all(
          sets.map(async (set) => {
            const response = await axiosClient.get<Card[]>(
              `${process.env.NEXT_PUBLIC_API_URL}/api/cards/set/${set.code}`,
              {
                headers: {
                  Authorization: `Bearer ${session.accessToken}`,
                },
                withCredentials: true,
              },
            );
            result[set.code] = response.data;
          }),
        );

        setCardsBySet(result);
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement des cartes');
        toast.error('Erreur lors du chargement des cartes');
      } finally {
        setLoading(false);
      }
    };

    if (sets.length > 0) {
      fetchCards();
    }
  }, [sets, session]);

  return { cardsBySet, loading, error };
};

export default useFetchCardsBySets;
