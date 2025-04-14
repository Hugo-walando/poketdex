'use client';

import { useEffect } from 'react';
import useFetchSets from '@/app/hooks/useFetchSets';
import useFetchAllCards from '@/app/hooks/useFetchAllCards';
import { useGlobalData } from '@/app/store/useGlobalData';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/app/store/useUserStore';

export default function GlobalDataLoader() {
  console.log('📦 GlobalDataLoader rendered');

  const { data: session, status } = useSession();

  const setUser = useUserStore((s) => s.setUser);
  const clearUser = useUserStore((s) => s.clearUser);
  const setUserLoading = useUserStore((s) => s.setLoading);

  const sets = useGlobalData((s) => s.sets);
  const setSets = useGlobalData((s) => s.setSets);
  const setAllCardsBySet = useGlobalData((s) => s.setAllCardsBySet);

  const { sets: fetchedSets, loading: setsLoading } = useFetchSets();
  const { cardsBySet, loading: cardsLoading } = useFetchAllCards();
  // 🔐 Gestion user
  useEffect(() => {
    setUserLoading(true);

    if (status === 'authenticated' && session?.user?.id) {
      console.log('🧍 Saving user to store');
      setUser({
        id: session.user.id,
        email: session.user.email ?? '',
        username: session.user.username ?? '',
        friend_code: session.user.friend_code ?? '',
        accessToken: session.accessToken ?? '',
      });
    }

    if (status === 'unauthenticated') {
      clearUser();
    }
  }, [status, session, clearUser, setUser, setUserLoading]);

  // 📥 Stocker les sets
  useEffect(() => {
    if (!setsLoading && fetchedSets.length > 0 && sets.length === 0) {
      console.log('📦 Saving sets to store...');
      setSets(fetchedSets);
    }
  }, [setsLoading, fetchedSets, sets, setSets]);

  // 📥 Stocker les cartes
  useEffect(() => {
    if (!cardsLoading && Object.keys(cardsBySet).length > 0) {
      console.log('🃏 Saving all cards to store...');
      setAllCardsBySet(cardsBySet);
    }
  }, [cardsLoading, cardsBySet, setAllCardsBySet]);

  return null;
}
