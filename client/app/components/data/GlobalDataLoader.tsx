'use client';

import { useEffect } from 'react';
import useFetchSets from '@/app/hooks/useFetchSets';
import useFetchCardsBySetsManual from '@/app/hooks/useFetchCardsBySet';
import { useGlobalData } from '@/app/store/useGlobalData';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/app/store/useUserStore';

export default function GlobalDataLoader() {
  console.log('📦 GlobalDataLoader rendered');
  const { data: session, status } = useSession();
  const setUser = useUserStore((s) => s.setUser);
  const { sets: fetchedSets, loading: setsLoading } = useFetchSets();
  const { sets, setSets, cardsBySet, setCardsBySet } = useGlobalData();

  const {
    cardsBySet: fetchedCardsBySet,
    loading: cardsLoading,
    triggerFetch,
  } = useFetchCardsBySetsManual();

  useEffect(() => {
    if (
      status === 'authenticated' &&
      session.user &&
      session.user.email &&
      session.user.id // 👈 On vérifie explicitement
    ) {
      setUser({
        id: session.user.id,
        email: session.user.email,
        username: session.user.username,
        friend_code: session.user.friend_code,
        accessToken: session.accessToken,
      });
    }
  }, [session, status, setUser]);

  // 🧠 Sauver les sets dans le global store
  useEffect(() => {
    if (!setsLoading && fetchedSets.length > 0 && sets.length === 0) {
      console.log('📝 Saving sets to global store...');
      setSets(fetchedSets);
    }
  }, [setsLoading, fetchedSets, sets.length, setSets]);

  // 🧠 Une fois les sets stockés, on déclenche manuellement le fetch des cartes
  useEffect(() => {
    if (sets.length > 0 && Object.keys(cardsBySet).length === 0) {
      triggerFetch(sets);
    }
  }, [sets, cardsBySet, triggerFetch]);

  // 🧠 Une fois fetchées, on les ajoute au store
  useEffect(() => {
    if (
      !cardsLoading &&
      Object.keys(fetchedCardsBySet).length > 0 &&
      Object.keys(cardsBySet).length === 0
    ) {
      console.log('📝 Saving cards to global store...');
      Object.entries(fetchedCardsBySet).forEach(([setCode, cards]) => {
        setCardsBySet(setCode, cards);
      });
    }
  }, [cardsLoading, fetchedCardsBySet, cardsBySet, setCardsBySet]);

  return null;
}
