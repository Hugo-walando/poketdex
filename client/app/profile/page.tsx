'use client';
import { useSession } from 'next-auth/react';

export default function Profile() {
  const { data: session } = useSession();

  if (!session) {
    return <p className='text-center mt-10'>🔒 Vous devez être connecté</p>;
  }

  return <div>Bonjour {session?.user?.email}</div>;
}
