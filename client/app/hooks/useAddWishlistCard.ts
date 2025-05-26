import { useState } from 'react';
import axiosClient from '@/lib/axios';
import { useUserStore } from '@/app/store/useUserStore';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { useUIModalStore } from '../store/useUIModalStore';

const useAddWishlistCard = () => {
  const { user } = useUserStore();

  const { openCompleteProfileModal } = useUIModalStore();

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

      toast.success('Carte Ajouté à la wishlist');

      return res.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;

      console.error('❌ Erreur lors de l’ajout :', err);
      setError('Erreur lors de l’ajout à la collection');
      if (axiosError.response?.data?.message?.includes('Profil incomplet')) {
        toast.error('⚠️ Veuillez compléter votre profil pour continuer');
        openCompleteProfileModal();
      }
    } finally {
      setLoading(false);
    }
  };

  return { addWishlistCard, loading, error };
};

export default useAddWishlistCard;
