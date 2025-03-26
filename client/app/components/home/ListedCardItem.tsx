'use client';

import { ListedCard } from '@/app/types';
import Image from 'next/image';

interface Props {
  data: ListedCard;
  onClick: () => void;
}

export default function ListedCardItem({ data, onClick }: Props) {
  return (
    <div
      className='relative cursor-pointer transition-all hover:scale-110'
      onClick={onClick}
    >
      <Image
        src={data.card.img_url}
        alt={data.card.name}
        width={150}
        height={200}
        className='rounded-lg mx-auto'
      />

      <div className='flex items-center gap-2 mt-2 px-3'>
        <Image
          src={data.user.profile_picture}
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
