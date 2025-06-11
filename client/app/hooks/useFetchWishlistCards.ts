import { useEffect, useState } from 'react';
import axiosClient from '@/lib/axios';
import { useUserStore } from '@/app/store/useUserStore';
import toast from 'react-hot-toast';
import { WishlistCard } from '@/app/types';
import axios from 'axios';
import { logErrorToSentry } from '../utils/logErrorToSentry';

const useFetchWishlistCards = () => {
  const user = useUserStore((state) => state.user);
  const [wishlistCards, setWishlistCards] = useState<WishlistCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.accessToken) return;

    const fetchWishlistCards = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosClient.get<WishlistCard[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist-cards/me`,
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          },
        );
        setWishlistCards(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          // Ne pas afficher de toast si erreur 401 (déjà gérée globalement)
          if (err.response?.status === 401) return;

          const message =
            err.response?.data?.message ||
            'Erreur lors du chargement des cartes wishlists';
          setError(message);
          toast.error(message);
          logErrorToSentry(err, {
            feature: 'useFetchWhishlistCards',
            userId: user.id!,
          });
        } else {
          setError('Erreur inconnue');
          toast.error('Erreur inconnue');
          logErrorToSentry(err, {
            feature: 'useFetchWhishlistCards',
            userId: user.id!,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistCards();
  }, [user?.accessToken, user?.id]);

  return { wishlistCards, loading, error };
};

export default useFetchWishlistCards;
