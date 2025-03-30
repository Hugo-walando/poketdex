'use client';

import { MatchGroup } from '@/app/types';
import Image from 'next/image';
import { useState } from 'react';
import MatchItem from './MatchItem';

interface MatchGroupItemProps {
  group: MatchGroup;
}

export default function MatchGroupItem({ group }: MatchGroupItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='bg-white rounded-xl shadow-base'>
      <div
        className='flex items-center justify-between p-4 cursor-pointer'
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='flex items-center gap-3'>
          <Image
            src={group.user.profile_picture}
            alt={group.user.username}
            width={32}
            height={32}
            className='rounded-full'
          />
          <span className='text-dark-base font-semibold'>
            {group.user.username} ({group.trades.length} matchs)
          </span>
        </div>
        <span className='text-sm text-grayblue'>
          {isOpen ? 'Masquer' : 'Voir les cartes'}
        </span>
      </div>

      {isOpen && (
        <div className='px-4 pb-4 space-y-4'>
          {group.trades.map((match) => (
            <MatchItem key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
