'use client';

import { useState } from 'react';
import axiosClient from '@/lib/axios';
import { useUserStore } from '@/app/store/useUserStore'; // 🆕 pour récupérer le token

const useCreateTradeRequests = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserStore(); // 🆕

  const createRequests = async (matchIds: string[]) => {
    if (!user?.accessToken) {
      console.error('❌ Utilisateur non authentifié.');
      setError('Non authentifié.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('📡 Envoi des TradeRequests...');

      await Promise.all(
        matchIds.map((matchId) =>
          axiosClient.post(
            '/api/trade-requests',
            { matchId },
            {
              headers: {
                Authorization: `Bearer ${user.accessToken}`,
              },
            },
          ),
        ),
      );

      console.log('✅ Tous les TradeRequests ont été créés');
    } catch (err) {
      console.error('❌ Erreur en créant les TradeRequests', err);
      setError('Erreur lors de la création des échanges.');
    } finally {
      setLoading(false);
    }
  };

  return { createRequests, loading, error };
};

export default useCreateTradeRequests;
