// app/components/GlobalDataLoader.tsx
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

  const { sets, loading: setsLoading } = useFetchSets();
  const { cardsBySet, loading: cardsLoading } = useFetchAllCards();

  const storeSets = useGlobalData((s) => s.setSets);
  const storeCards = useGlobalData((s) => s.setAllCardsBySet);

  // 🔐 Sauvegarde de l'utilisateur dans le store Zustand
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
  }, [status, session, setUser, clearUser, setUserLoading]);

  // 📦 Sauvegarde des sets dans Zustand une seule fois
  useEffect(() => {
    if (!setsLoading && sets.length > 0) {
      console.log('📦 Saving sets to store...');
      storeSets(sets);
    }
  }, [sets, setsLoading, storeSets]);

  // 🃏 Sauvegarde des cartes dans Zustand une seule fois
  useEffect(() => {
    if (!cardsLoading && Object.keys(cardsBySet).length > 0) {
      console.log('🃏 Saving all cards to store...');
      storeCards(cardsBySet);
    }
  }, [cardsBySet, cardsLoading, storeCards]);

  return null;
}
