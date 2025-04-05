'use client';
import { useSession } from 'next-auth/react';
import LogoutButton from '../components/ui/LogoutButton';

export default function Profile() {
  const { data: session } = useSession();

  if (!session) {
    return <p className='text-center mt-10'>🔒 Vous devez être connecté</p>;
  } else {
    return (
      <div>
        Bonjour {session?.user?.email} <LogoutButton />
      </div>
    );
  }
}
