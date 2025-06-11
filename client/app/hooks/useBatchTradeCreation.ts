'use client';

import { useState } from 'react';
import axiosClient from '@/lib/axios';
import { useUserStore } from '@/app/store/useUserStore';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { TradeRequest } from '@/app/types';
import { logErrorToSentry } from '../utils/logErrorToSentry';

const useBatchTradeCreation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserStore();

  const createTradesFromMatches = async (
    matchIds: string[],
  ): Promise<TradeRequest[] | null> => {
    if (!user?.accessToken) {
      setError('Non authentifié.');
      toast.error('Vous devez être connecté.');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.post(
        '/api/trade-requests/batch',
        { matchIds },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      );

      toast.success('Demandes envoyées avec succès !');
      return response.data as TradeRequest[];
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      logErrorToSentry(err, {
        feature: 'useAddWishlistCard',
        userId: user.id!,
      });
      const backendMessage =
        axiosError.response?.data?.message ||
        'Erreur lors de la création des échanges.';

      setError(backendMessage);
      toast.error(backendMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createTradesFromMatches, loading, error };
};

export default useBatchTradeCreation;
