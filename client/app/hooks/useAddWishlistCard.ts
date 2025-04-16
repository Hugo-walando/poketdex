import { useState } from 'react';
import axiosClient from '@/lib/axios';
import { useUserStore } from '@/app/store/useUserStore';
import { useCollectionStore } from '@/app/store/useCollectionStore';
import toast from 'react-hot-toast';

const useAddWishlistCard = () => {
  const { user } = useUserStore();
  const addWishlistCardToStore = useCollectionStore(
    (s) => s.addWishlistCardToStore,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addWishlistCard = async (cardId: string) => {
    if (!user?.accessToken) {
      setError('Non authentifié');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await axiosClient.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist-cards`,
        { cardId },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      );

      // ✅ Ajout direct au store Zustand
      toast.success('✅ Carte ajoutée à la collection');

      addWishlistCardToStore(res.data);

      return res.data;
    } catch (err) {
      console.error('❌ Erreur lors de l’ajout à la wishlist :', err);
      setError('Erreur lors de l’ajout à la wishlist');
    } finally {
      setLoading(false);
    }
  };

  return { addWishlistCard, loading, error };
};

export default useAddWishlistCard;
