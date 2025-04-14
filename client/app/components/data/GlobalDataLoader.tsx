'use client';
'use client';

import { useEffect, useRef } from 'react';
import useFetchSets from '@/app/hooks/useFetchSets';
import useFetchAllCards from '@/app/hooks/useFetchAllCards';
import { useGlobalData } from '@/app/store/useGlobalData';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/app/store/useUserStore';
export default function GlobalDataLoader() {
  console.log('📦 GlobalDataLoader rendered');

  const hasInitialized = useRef(false); // ✅ Ajout

  const { data: session, status } = useSession();
  const setUser = useUserStore((s) => s.setUser);
  const clearUser = useUserStore((s) => s.clearUser);
  const setUserLoading = useUserStore((s) => s.setLoading);

  const sets = useGlobalData((s) => s.sets);
  const setSets = useGlobalData((s) => s.setSets);
  const setAllCardsBySet = useGlobalData((s) => s.setAllCardsBySet);

  const { sets: fetchedSets, loading: setsLoading } = useFetchSets();
  const { cardsBySet, loading: cardsLoading } = useFetchAllCards();

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    console.log('✅ Initializing GlobalDataLoader');

    setUserLoading(true);

    if (status === 'authenticated' && session?.user?.id) {
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

    if (!setsLoading && fetchedSets.length > 0 && sets.length === 0) {
      console.log('📝 Saving sets to global store...');
      setSets(fetchedSets);
    }

    if (!cardsLoading && Object.keys(cardsBySet).length > 0) {
      console.log('📝 Saving all cards to global store...');
      setAllCardsBySet(cardsBySet);
    }
  }, [
    status,
    session,
    setUser,
    clearUser,
    setUserLoading,
    setsLoading,
    fetchedSets,
    sets.length,
    setSets,
    cardsLoading,
    cardsBySet,
    setAllCardsBySet,
  ]);

  return null;
}
