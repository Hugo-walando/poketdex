'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

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
    return <div className='text-center py-10'>Chargement...</div>;
  }

  if (status === 'authenticated') {
    return <>{children}</>;
  }

  return null;
}
