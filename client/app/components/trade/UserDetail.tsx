'use client';

import Image from 'next/image';
import { AppUser } from '@/app/types'; // Ton type utilisateur
import FriendCode from './FriendCode';

interface UserDetailProps {
  user: AppUser;
}

export default function UserDetail({ user }: UserDetailProps) {
  return (
    <div className='bg-white shadow-base rounded-xl p-4 flex flex-col gap-4'>
      <div className='flex lg:flex-col lg:justify-center items-center gap-2'>
        <Image
          src={user.profile_picture || '/testimgs/avatars/Av1.png'}
          alt={user.username}
          width={0}
          height={0}
          sizes='100vw'
          className='h-20 w-20 rounded-full'
        />
        <div className='flex flex-col lg:items-center gap-1 w-full'>
          <span className='text-dark-base truncate'>{user.username}</span>
          <span className='text-light-sm sm:flex truncate items-center lg:flex-col '>
            Code ami :
            <FriendCode code={user.friend_code} />
          </span>

          <p className='text-gray-sm'>
            <span className='text-green-sm '>125</span> échanges réalisés
          </p>
        </div>
      </div>
    </div>
  );
}
