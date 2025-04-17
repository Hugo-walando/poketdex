'use client';

import { useEffect, useState } from 'react';
import axiosClient from '@/lib/axios';
import { useMatchStore } from '@/app/store/useMatchStore';
import { useUserStore } from '@/app/store/useUserStore';

const useFetchMatches = () => {
  const { user } = useUserStore();
  const setMatches = useMatchStore((state) => state.setMatches);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.accessToken) {
      setError('Non authentifié');
      return;
    }
    const fetchMatches = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('📡 Fetching matches...');
        const res = await axiosClient.get('/api/matches/me', {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });

        setMatches(res.data);
        console.log('✅ Matches récupérés :', res.data.length, 'matchs');
      } catch (err) {
        console.error('❌ Erreur fetch matches :', err);
        setError('Erreur lors de la récupération des matchs');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user]);

  return { loading, error };
};

export default useFetchMatches;
