import { useUserStore } from '@/app/store/useUserStore';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import Loader from '../ui/Loader';

interface Props {
  children: ReactNode;
}

export default function ProtectedPage({ children }: Props) {
  const { user, isLoading } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) return <Loader />;

  return <>{children}</>;
}
