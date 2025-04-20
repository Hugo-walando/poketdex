import { useState } from 'react';
import axiosClient from '@/lib/axios';
import { useUserStore } from '@/app/store/useUserStore';
import { useCollectionStore } from '@/app/store/useCollectionStore';
import toast from 'react-hot-toast';

const useRemoveWishlistCard = () => {
  const { user } = useUserStore();
  const removeWishlistCardFromStore = useCollectionStore(
    (s) => s.removeWishlistCardFromStore,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeWishlistCard = async (cardId: string) => {
    if (!user?.accessToken) {
      setError('Non authentifié');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await axiosClient.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist-cards/${cardId}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      );

      removeWishlistCardFromStore(cardId);
      toast.success('🗑️ Carte supprimée de la wishlist');
    } catch (err) {
      console.error('❌ Erreur lors de la suppression :', err);
      setError('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  return { removeWishlistCard, loading, error };
};

export default useRemoveWishlistCard;
