'use client';

import { useState, useEffect } from 'react';
import axiosClient from '@/lib/axios';
import { WishlistCard } from '@/app/types';
import toast from 'react-hot-toast';
import axios from 'axios';

const useFetchWishlistForQuickTrade = (
  userId: string | null,
  rarity: number | null,
) => {
  const [wishlistCards, setWishlistCards] = useState<WishlistCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || rarity === null) return;

    const fetchWishlist = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axiosClient.get<WishlistCard[]>(
          `/api/wishlist-cards/user/${userId}?rarity=${rarity}`,
        );

        setWishlistCards(res.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          // Ne pas afficher de toast si erreur 401 (déjà gérée globalement)
          if (err.response?.status === 401) return;

          const message =
            err.response?.data?.message ||
            'Erreur lors du chargement des wishlists pour quicktrade';
          setError(message);
          toast.error(message);
        } else {
          setError('Erreur inconnue');
          toast.error('Erreur inconnue');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userId, rarity]);

  return { wishlistCards, loading, error };
};

export default useFetchWishlistForQuickTrade;
