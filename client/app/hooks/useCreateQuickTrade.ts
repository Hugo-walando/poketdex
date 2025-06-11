'use client';

import { useState } from 'react';
import axiosClient from '@/lib/axios';
import { useUserStore } from '@/app/store/useUserStore';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { TradeRequest } from '@/app/types';
import { useUIModalStore } from '../store/useUIModalStore';
import { logErrorToSentry } from '../utils/logErrorToSentry';

const useCreateQuickTrade = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserStore();
  const { openCompleteProfileModal } = useUIModalStore();

  const createQuickTrade = async ({
    listedCardId,
    myCardOfferedId,
    toUserId,
  }: {
    listedCardId: string;
    myCardOfferedId: string;
    toUserId: string;
  }): Promise<TradeRequest | null> => {
    if (!user?.accessToken) {
      setError('Non authentifié.');
      toast.error('Vous devez être connecté.');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.post(
        '/api/trade-requests/quick',
        {
          listedCardId,
          myCardOfferedId,
          toUserId,
        },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      );

      toast.success('Demande envoyée avec succès !');
      return response.data as TradeRequest;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const backendMessage =
        axiosError.response?.data?.message ||
        'Erreur lors de la création de la demande.';
      if (backendMessage.includes('compléter votre profil')) {
        openCompleteProfileModal();
      } else {
        logErrorToSentry(err, {
          feature: 'useAddWishlistCard',
          userId: user.id!,
        });
      }
      setError(backendMessage);
      toast.error(backendMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createQuickTrade, loading, error };
};

export default useCreateQuickTrade;
