'use client';

import { MatchTrade } from '@/app/types';
import Image from 'next/image';

interface Props {
  match: MatchTrade;
}

export default function MatchItem({ match }: Props) {
  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex items-center gap-2'>
        <Image
          src={match.requested_card.img_url}
          alt={match.requested_card.name}
          width={60}
          height={60}
          className='rounded-md'
        />
        <span className='text-sm font-medium'>
          {match.requested_card.official_id}
        </span>
      </div>
      <div className='text-sm'>contre</div>
      <div className='flex items-center gap-2'>
        <span className='text-sm font-medium'>
          {match.offered_card.official_id}
        </span>
        <Image
          src={match.offered_card.img_url}
          alt={match.offered_card.name}
          width={60}
          height={60}
          className='rounded-md'
        />
      </div>
    </div>
  );
}
