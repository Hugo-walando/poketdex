'use client';

import { ListedCard } from '@/app/types';
import { cn } from '@/app/utils/cn';
import Image from 'next/image';
import UserStatusIndicator from '../ui/UserStatusIndicator';
import { useState } from 'react';
import { useCollectionStore } from '@/app/store/useCollectionStore';
import { HeartIcon } from 'lucide-react';

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
  const wishlistCards = useCollectionStore((s) => s.wishlistCards);

  const isInWishlist = wishlistCards.some(
    (w) =>
      w.card.official_id === data.card.official_id &&
      w.card.set_code === data.card.set_code,
  );

  return (
    <div
      className={cn(
        'relative mx-auto cursor-pointer transition-all hover:scale-110 rounded-xl',
      )}
      onClick={onClick}
    >
      {!isImageLoaded && (
        <div className='absolute inset-0 bg-gray-200 animate-pulse rounded-md z-10' />
      )}

      <div className='relative inline-block shrink-0 '>
        <Image
          src={data.card.img_url}
          alt={data.card.name}
          width={0}
          height={0}
          sizes='100vw'
          className={cn(
            'w-[120px] sm:w-[130px] md:w-[150px] lg:w-[170px] xl:w-[190px] 2xl:w-[210px] h-auto rounded-md shadow-base ',
            isSelected && 'ring-2 ring-primarygreen rounded-md',
          )}
          onLoad={() => setImageLoaded(true)}
          priority={true}
        />
        {isInWishlist && (
          <div className='rounded-full absolute top-1 right-1 w-8 h-8 bg-pink-400 flex items-center justify-center'>
            <HeartIcon className='w-6 h-6 text-white ' />
          </div>
        )}
      </div>

      <div className='flex items-center justify-center gap-2 mt-2 pl-1'>
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
