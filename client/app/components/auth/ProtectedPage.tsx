'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import Loader from '../ui/Loader';

interface Props {
  children: ReactNode;
}

export default function ProtectedPage({ children }: Props) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    // Tu peux afficher un spinner, une splash screen, ou rien du tout ici
    return <Loader />;
  }

  if (status === 'authenticated') {
    return <>{children}</>;
  }

  return null;
}
