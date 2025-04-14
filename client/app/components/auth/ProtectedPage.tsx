import { useUserStore } from '@/app/store/useUserStore';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import Loader from '../ui/Loader';

interface Props {
  children: ReactNode;
}

export default function ProtectedPage({ children }: Props) {
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return <Loader />;

  return <>{children}</>;
}
