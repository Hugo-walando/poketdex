'use client';

import { Power } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className='text-red-500 font-semibold bg-white rounded-full p-2 shadow-base hover:cursor-pointer'
    >
      <Power />
    </button>
  );
}
