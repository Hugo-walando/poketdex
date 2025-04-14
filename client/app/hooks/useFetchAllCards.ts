// hooks/useFetchAllCards.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '@/app/types'; // adapte selon ton projet
import { useUserStore } from '../store/useUserStore';
import toast from 'react-hot-toast';

export default function useFetchAllCards() {
  const user = useUserStore((state) => state.user);
  const [cardsBySet, setCardsBySet] = useState<Record<string, Card[]>>({});
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[🔥 useFetchAllCards] useEffect triggered');

    if (user) {
      const fetchCards = async () => {
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
          console.log('✅ Cards fetched ');
          setSuccess('✅ Cards chargés avec succès');
          toast.success('Cards chargés avec succès');
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
    }
  }, [user]);

  return { cardsBySet, loading, error, success };
}
