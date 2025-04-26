'use client';

import { ListedCard } from '@/app/types';
import { cn } from '@/app/utils/cn';
import Image from 'next/image';

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
  return (
    <div
      className={cn(
        'relative cursor-pointer transition-all hover:scale-110 rounded-xl',
      )}
      onClick={onClick}
    >
      <Image
        src={data.card.img_url}
        alt={data.card.name}
        width={150}
        height={200}
        className={cn(
          'mx-auto',
          isSelected && 'ring-2 ring-primarygreen rounded-md',
        )}
      />

      <div className='flex items-center gap-2 mt-2 pl-1'>
        <Image
          src={data.user.profile_picture || '/testimgs/avatars/Av1.png'}
          alt={data.user.username}
          width={24}
          height={24}
          className='rounded-full'
        />
        <span className='text-sm text-darkgray font-semibold truncate'>
          {data.user.username}
        </span>
      </div>
    </div>
  );
}
