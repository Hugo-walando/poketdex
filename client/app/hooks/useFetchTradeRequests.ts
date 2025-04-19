// app/hooks/useFetchTradeRequests.ts
'use client';

import { useEffect, useState } from 'react';
import axiosClient from '@/lib/axios';
import { useTradeRequestStore } from '@/app/store/useTradeRequestStore';
import { useUserStore } from '@/app/store/useUserStore';
import { groupTradeRequestsByUser } from '@/app/utils/groupTradeRequests';

const useFetchTradeRequests = () => {
  const { user } = useUserStore();
  const setTradeGroups = useTradeRequestStore((state) => state.setTradeGroups);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.accessToken) {
      setError('Non authentifié');
      return;
    }

    const fetchTrades = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('📡 Fetching trade requests...');
        const res = await axiosClient.get('/api/trades/me', {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });

        const grouped = groupTradeRequestsByUser(res.data, user.id);
        setTradeGroups(grouped);

        console.log('✅ Trade requests récupérés et groupés :', grouped.length);
      } catch (err) {
        console.error('❌ Erreur fetch trades :', err);
        setError('Erreur lors de la récupération des échanges');
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, [user]);

  return { loading, error };
};

export default useFetchTradeRequests;
