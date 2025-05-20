'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const TokenTimer = () => {
  const { data: session } = useSession();
  console.log('TokenTimer session', session);

  useEffect(() => {
    if (!session?.expires) return;

    const interval = setInterval(() => {
      const now = new Date();
      const expiresAt = new Date(Number(session.expiresAt) * 1000);
      const remainingMs = expiresAt.getTime() - now.getTime();

      if (remainingMs <= 0) {
        console.warn('❌ Token expiré !');
        clearInterval(interval);
        return;
      }

      const seconds = Math.floor((remainingMs / 1000) % 60);
      const minutes = Math.floor((remainingMs / 1000 / 60) % 60);
      const hours = Math.floor(remainingMs / 1000 / 60 / 60);

      console.log(`⏳ Token expire dans ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  return null;
};

export default TokenTimer;
