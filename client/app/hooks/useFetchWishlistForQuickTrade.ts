'use client';

import { useState, useEffect } from 'react';
import axiosClient from '@/lib/axios';
import { WishlistCard } from '@/app/types';
import toast from 'react-hot-toast';

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
        console.error('❌ Erreur récupération wishlist pour QuickTrade:', err);
        setError('Erreur lors de la récupération de la wishlist.');
        toast.error('Impossible de charger la wishlist pour cet utilisateur.');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userId, rarity]);

  return { wishlistCards, loading, error };
};

export default useFetchWishlistForQuickTrade;
