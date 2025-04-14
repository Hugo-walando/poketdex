'use client';
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

  // 🔐 Auth
  const setUser = useUserStore((s) => s.setUser);
  const clearUser = useUserStore((s) => s.clearUser);
  const setUserLoading = useUserStore((s) => s.setLoading);

  // 📦 Zustand
  const sets = useGlobalData((s) => s.sets);
  const setSets = useGlobalData((s) => s.setSets);
  const setAllCardsBySet = useGlobalData((s) => s.setAllCardsBySet);

  // 🔁 Hook fetch
  const { sets: fetchedSets, loading: setsLoading } = useFetchSets();
  const { cardsBySet, loading: cardsLoading } = useFetchAllCards();

  // 🔐 Gérer l'utilisateur
  useEffect(() => {
    setUserLoading(true);

    if (status === 'authenticated' && session.user && session.user.id) {
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
  }, [status, session, setUser, clearUser, setUserLoading]);

  // 📥 Stocker les sets
  useEffect(() => {
    if (!setsLoading && fetchedSets.length > 0 && sets.length === 0) {
      console.log('📝 Saving sets to global store...');
      setSets(fetchedSets);
    }
  }, [setsLoading, fetchedSets, sets.length, setSets]);

  // 📥 Stocker les cartes groupées
  useEffect(() => {
    if (!cardsLoading && Object.keys(cardsBySet).length > 0) {
      console.log('📝 Saving all cards to global store...');
      setAllCardsBySet(cardsBySet);
    }
  }, [cardsLoading, cardsBySet, setAllCardsBySet]);

  return null;
}
