'use client';

import { ListedCard } from '@/app/types';
import { cn } from '@/app/utils/cn';
import Image from 'next/image';
import UserStatusIndicator from '../ui/UserStatusIndicator';
import { useState } from 'react';

interface ListedCardProps {
  data: ListedCard;
  onClick: () => void;
  isSelected?: boolean;
}

export default function ListedCardItem({
  data,
  onClick,
  isSelected,
}: ListedCardProps) {
  const user = data.user;
  const [isImageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className={cn(
        'relative cursor-pointer transition-all hover:scale-110 rounded-xl',
      )}
      onClick={onClick}
    >
      {!isImageLoaded && (
        <div className='absolute inset-0 bg-gray-200 animate-pulse rounded-md z-10' />
      )}
      <Image
        src={data.card.img_url}
        alt={data.card.name}
        width={0}
        height={0}
        sizes='100vw'
        className={cn(
          'w-[120px] sm:w-[130px] md:w-[150px] lg:w-[170px] xl:w-[190px] 2xl:w-[210px] h-auto rounded-md shadow-base mx-auto',
          isSelected && 'ring-2 ring-primarygreen rounded-md',
        )}
        onLoad={() => setImageLoaded(true)}
        priority={true}
      />

      <div className='flex items-center gap-2 mt-2 pl-1'>
        <Image
          src={data.user.profile_picture || '/avatars/Av1.png'}
          alt={data.user.username}
          width={24}
          height={24}
          className='rounded-full'
        />
        <div className='flex items-center gap-1'>
          <span className='text-sm text-darkgray font-semibold truncate max-w-[80px]'>
            {data.user.username}
          </span>
          <UserStatusIndicator userId={user._id} />
        </div>
      </div>
    </div>
  );
}
