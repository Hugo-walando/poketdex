'use client';

import { useEffect, useState, useCallback } from 'react';
import axiosClient from '@/lib/axios';
import { useTradeRequestStore } from '@/app/store/useTradeRequestStore';
import { useUserStore } from '@/app/store/useUserStore';
import { groupTradeRequestsByUser } from '@/app/utils/groupTradeRequests';
import { logErrorToSentry } from '../utils/logErrorToSentry';

const useFetchTradeRequests = (enabled: boolean = true) => {
  const { user } = useUserStore();
  const setTradeGroups = useTradeRequestStore((state) => state.setTradeGroups);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrades = useCallback(async () => {
    if (!user?.accessToken) {
      setError('Non authentifié');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axiosClient.get('/api/trade-requests/me', {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      if (!user?.id) {
        setError('Identifiant utilisateur manquant.');
        return;
      }

      const grouped = groupTradeRequestsByUser(res.data, user.id);
      setTradeGroups(grouped);
    } catch (err) {
      console.error('❌ Erreur fetch trades :', err);
      setError('Erreur lors de la récupération des échanges');
      logErrorToSentry(err, {
        feature: 'useFetchTradeRequests',
        userId: user.id!,
      });
    } finally {
      setLoading(false);
    }
  }, [user, setTradeGroups]);

  useEffect(() => {
    if (enabled) fetchTrades();
  }, [fetchTrades, enabled]);

  return { loading, error, refetch: fetchTrades };
};

export default useFetchTradeRequests;
