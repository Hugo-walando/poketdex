import { useState } from 'react';
import axiosClient from '@/lib/axios';
import { Card, Set } from '@/app/types';
import { useUserStore } from '../store/useUserStore';
import { logErrorToSentry } from '../utils/logErrorToSentry';

export default function useFetchCardsBySetsManual() {
  const user = useUserStore((state) => state.user);
  const [cardsBySet, setCardsBySet] = useState<Record<string, Card[]>>({});
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const triggerFetch = async (sets: Set[]) => {
    if (sets.length === 0 || hasFetched) return;

    setLoading(true);
    const fetched: Record<string, Card[]> = {};

    try {
      for (const set of sets) {
        const res = await axiosClient.get<Card[]>(
          `/api/cards/set/${set.code}`,
          {
            headers: {
              Authorization: `Bearer ${user!.accessToken}`,
            },
            withCredentials: true,
          },
        );
        fetched[set.code] = res.data;
      }
      setCardsBySet(fetched);
      setHasFetched(true);
    } catch (err) {
      console.error('❌ Error fetching cards by set:', err);
      logErrorToSentry(err, {
        feature: 'useFetchCardsBySet',
        userId: user!.id!,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    cardsBySet,
    loading,
    triggerFetch,
  };
}
