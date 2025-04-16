import { useState } from 'react';
import axiosClient from '@/lib/axios';
import { useUserStore } from '@/app/store/useUserStore';
import { useCollectionStore } from '@/app/store/useCollectionStore';
import toast from 'react-hot-toast';

const useAddListedCard = () => {
  const { user } = useUserStore();
  const addListedCardToStore = useCollectionStore(
    (s) => s.addListedCardToStore,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addListedCard = async (cardId: string) => {
    if (!user?.accessToken) {
      setError('Non authentifié');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await axiosClient.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/listed-cards`,
        { cardId },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      );

      // ✅ Ajouter au store local
      toast.success('✅ Carte ajoutée à la collection');
      addListedCardToStore(res.data);

      return res.data;
    } catch (err) {
      console.error('❌ Erreur lors de l’ajout :', err);
      setError('Erreur lors de l’ajout à la collection');
    } finally {
      setLoading(false);
    }
  };

  return { addListedCard, loading, error };
};

export default useAddListedCard;
