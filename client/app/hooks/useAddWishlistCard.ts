import { useState } from 'react';
import axiosClient from '@/lib/axios';
import { useUserStore } from '@/app/store/useUserStore';
import toast from 'react-hot-toast';

const useAddWishlistCard = () => {
  console.log('🔵 useAddWishlistCard appelé');

  const { user } = useUserStore();

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
      console.log('🔵 Envoi de la requête pour ajouter à la wishlist', cardId);

      const res = await axiosClient.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist-cards`,
        { cardId },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      );

      toast.success('✅ Carte Ajouté à la wishlist');

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
