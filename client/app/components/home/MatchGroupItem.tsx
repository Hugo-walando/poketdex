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
  const [selectedMatchIds, setSelectedMatchIds] = useState<string[]>([]);

  const toggleMatchSelection = (id: string) => {
    setSelectedMatchIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  return (
    <div className='bg-white rounded-xl shadow-base'>
      <div
        className='flex items-center justify-between px-4 py-2 cursor-pointer'
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
          <div className='flex max-w-[350px] items-center justify-between '>
            <span className='text-light-sm text-nowrap'>Vous recevez</span>
            <span className='text-light-sm text-nowrap'>Vous offrez</span>
          </div>
          {group.trades.map((match) => (
            <MatchItem
              key={match.id}
              match={match}
              isSelected={selectedMatchIds.includes(match.id)}
              onSelect={toggleMatchSelection}
            />
          ))}
        </div>
      )}
      {selectedMatchIds.length > 0 && (
        <button
          onClick={() =>
            console.log('Envoyer les demandes pour :', selectedMatchIds)
          }
          className='mt-4 w-full py-2 bg-primarygreen text-white rounded-xl font-semibold'
        >
          Envoyer {selectedMatchIds.length} demande(s)
        </button>
      )}
    </div>
  );
}
