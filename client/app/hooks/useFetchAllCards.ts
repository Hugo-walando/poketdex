// hooks/useFetchAllCards.ts
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Card } from '@/app/types'; // adapte selon ton projet

export default function useFetchAllCards() {
  const { data: session } = useSession();
  const [cardsBySet, setCardsBySet] = useState<Record<string, Card[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      if (!session?.accessToken) return;

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cards`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          },
        );

        setCardsBySet(res.data);
        setLoading(false);
      } catch (err) {
        if (err) {
          console.error('❌ Error fetching all cards:', err);
          setError('Erreur lors de la récupération des cartes');
          setLoading(false);
        }
      }
    };

    fetchCards();
  }, [session?.accessToken]);

  return { cardsBySet, loading, error };
}
