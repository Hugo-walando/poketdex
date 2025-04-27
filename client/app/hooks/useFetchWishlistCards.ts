import { useEffect, useState } from 'react';
import axiosClient from '@/lib/axios';
import { useUserStore } from '@/app/store/useUserStore';
import toast from 'react-hot-toast';
import { WishlistCard } from '@/app/types';

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
        if (err) {
          console.error('❌ Error fetching listed cards:', err);
        }
        setError('Erreur lors du chargement de la wishlist.');
        toast.error('❌ Impossible de charger la wishlist.');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistCards();
  }, [user?.accessToken]);

  return { wishlistCards, loading, error };
};

export default useFetchWishlistCards;
