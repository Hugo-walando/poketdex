import { useState } from 'react';
import axiosClient from '@/lib/axios';
import { useUserStore } from '@/app/store/useUserStore';
import { useCollectionStore } from '@/app/store/useCollectionStore';
import toast from 'react-hot-toast';

const useRemoveListedCard = () => {
  const { user } = useUserStore();
  const removeListedCardFromStore = useCollectionStore(
    (s) => s.removeListedCardFromStore,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeListedCard = async (cardId: string) => {
    if (!user?.accessToken) {
      setError('Non authentifié');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await axiosClient.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/listed-cards/${cardId}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      );

      removeListedCardFromStore(cardId);
      toast.success('❌ Carte retirée des doublons');
    } catch (err) {
      console.error('❌ Erreur lors de la suppression :', err);
      setError('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  return { removeListedCard, loading, error };
};

export default useRemoveListedCard;
