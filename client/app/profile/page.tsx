'use client';
import { useSession } from 'next-auth/react';
import LogoutButton from '../components/ui/LogoutButton';
import ProtectedPage from '../components/auth/ProtectedPage';

export default function Profile() {
  const { data: session } = useSession();

  return (
    <ProtectedPage>
      <div>
        Bonjour {session?.user?.email} <LogoutButton />
      </div>
    </ProtectedPage>
  );
}
