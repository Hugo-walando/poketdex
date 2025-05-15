'use client';

import Image from 'next/image';
import { AppUser } from '@/app/types'; // Ton type utilisateur
import FriendCode from './FriendCode';

interface UserDetailProps {
  user: AppUser;
}

export default function UserDetail({ user }: UserDetailProps) {
  console.log('UserDetail', user);
  return (
    <div className=' rounded-b-xl w-full bg-white shadow-base md:rounded-xl p-4 md:flex md:flex-col gap-4'>
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
          <span className='text-gray-base sm:flex truncate items-center lg:flex-col '>
            Code ami :
            <FriendCode code={user.friend_code} />
          </span>

          <p className='text-gray-sm'>
            <span className='text-green-sm '>{user.trade_count}</span> échange
            {user.trade_count > 1 ? 's' : ''} réalisés
          </p>
        </div>
      </div>
    </div>
  );
}
