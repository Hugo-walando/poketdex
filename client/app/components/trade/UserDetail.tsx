'use client';

import Image from 'next/image';
import { User } from '@/app/types'; // Ton type utilisateur

interface UserDetailProps {
  user: User;
}

export default function UserDetail({ user }: UserDetailProps) {
  return (
    <div className='bg-white shadow-base rounded-xl p-4 flex flex-col gap-4'>
      <div className='flex items-center gap-2'>
        <Image
          src={user.profile_picture}
          alt={user.username}
          width={0}
          height={0}
          sizes='100vw'
          className='h-20 w-20 rounded-full'
        />
        <div className='flex flex-col'>
          <span className='text-dark-base'>{user.username}</span>
          <span className='text-gray-sm truncate'>
            Code ami : {user.friend_code}
          </span>
          <p className='text-gray-sm'>
            <span className='text-dark-sm'>125</span> échanges réalisés
          </p>
        </div>
      </div>
    </div>
  );
}
