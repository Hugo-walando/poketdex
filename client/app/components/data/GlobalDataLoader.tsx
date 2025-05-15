'use client';

import { useEffect, useRef } from 'react';
import useFetchSets from '@/app/hooks/useFetchSets';
import useFetchAllCards from '@/app/hooks/useFetchAllCards';
import { useGlobalData } from '@/app/store/useGlobalData';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/app/store/useUserStore';

export default function GlobalDataLoader() {
  const { data: session, status } = useSession();

  const setUser = useUserStore((s) => s.setUser);
  const clearUser = useUserStore((s) => s.clearUser);
  const setUserLoading = useUserStore((s) => s.setLoading);
  const currentUser = useUserStore((s) => s.user);

  const { sets, loading: setsLoading } = useFetchSets();
  const { cardsBySet, loading: cardsLoading } = useFetchAllCards();

  const storeSets = useGlobalData((s) => s.setSets);
  const storeCards = useGlobalData((s) => s.setAllCardsBySet);

  const hasInitialized = useRef(false);

  // ✅ Gestion utilisateur
  useEffect(() => {
    if (status === 'loading') return;

    if (
      status === 'authenticated' &&
      session?.user?.id &&
      !hasInitialized.current &&
      !currentUser
    ) {
      hasInitialized.current = true;

      setUser({
        id: session.user.id,
        email: session.user.email ?? '',
        username: session.user.username ?? '',
        friend_code: session.user.friend_code ?? '',
        accessToken: session.accessToken ?? '',
        profile_picture: session.user.profile_picture ?? '',
      });

      setUserLoading(false);
    }

    if (status === 'unauthenticated') {
      clearUser();
      hasInitialized.current = false;
      setUserLoading(false);
    }
  }, [status, session, setUser, clearUser, setUserLoading, currentUser]);

  // 📦 Sauvegarde des sets
  useEffect(() => {
    if (!setsLoading && sets.length > 0) {
      storeSets(sets);
    }
  }, [sets, setsLoading, storeSets]);

  // 🃏 Sauvegarde des cartes
  useEffect(() => {
    if (!cardsLoading && Object.keys(cardsBySet).length > 0) {
      storeCards(cardsBySet);
    }
  }, [cardsBySet, cardsLoading, storeCards]);

  return null;
}
