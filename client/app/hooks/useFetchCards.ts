import { useEffect, useState } from 'react';
import axios from 'axios';
import axiosClient from '@/lib/axios';
import toast from 'react-hot-toast';
import { Card } from '@/app/types';

const useFetchCards = (setCode?: string) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      if (!setCode) return; // Si aucun set sélectionné, on ne fait rien

      setLoading(true);
      setError(null);

      try {
        const response = await axiosClient.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cards?set_code=${setCode}`,
        );
        setCards(response.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(
            err.response.data?.message ||
              'Erreur lors du chargement des cartes',
          );
        } else {
          setError('Erreur lors du chargement des cartes');
        }
        toast.error('Erreur lors du chargement des cartes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [setCode]);

  return { cards, loading, error };
};

export default useFetchCards;
