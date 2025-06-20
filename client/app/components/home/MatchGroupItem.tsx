'use client';

import { MatchGroup, Set } from '@/app/types';
import Image from 'next/image';
import { useState } from 'react';
import MatchItem from './MatchItem';
import { MinusIcon, PlusIcon } from 'lucide-react';

interface MatchGroupItemProps {
  group: MatchGroup;
  sets: Set[];
  selectedMatchIds: string[];
  onToggleMatchSelection: (id: string) => void;
}

export default function MatchGroupItem({
  group,
  sets,
  selectedMatchIds,
  onToggleMatchSelection,
}: MatchGroupItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='bg-white rounded-xl shadow-base'>
      <div
        className='flex sticky shadow-sm top-0 md:top-[-10px] bg-white rounded-lg z-10 items-center justify-between px-4 py-2 cursor-pointer'
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='flex items-center gap-3'>
          <Image
            src={group.user.profile_picture || '/avatars/Av1.png'}
            alt='USERNAME'
            width={32}
            height={32}
            className='rounded-full'
          />
          <span className='text-dark-sm sm:text-dark-base text-nowrap font-semibold'>
            {group.user.username} ({group.trades.length} matchs)
          </span>
        </div>

        <span className='text-sm text-grayblue flex sticky top-1  gap-2'>
          <div className=' text-nowrap sm:block md:hidden xl:block'>
            {isOpen ? 'Masquer' : 'Voir les cartes'}
          </div>
          {isOpen ? (
            <MinusIcon className='text-gray-lg' />
          ) : (
            <PlusIcon className='text-gray-lg' />
          )}
        </span>
      </div>

      {isOpen && (
        <div className='px-4 pb-4 pt-2 w-full max-w-[500px] mx-auto relative'>
          {/* Header aligné avec la grille */}
          <div className='sticky top-10 z-10 grid grid-cols-[minmax(0,1fr)_minmax(0,4fr)_minmax(0,2fr)_minmax(0,4fr)] gap-1 xl:gap-4 text-center text-gray-sm mb-2 text-nowrap'>
            <div></div> {/* Colonne checkbox */}
            <span className='bg-white px-2 py-1 rounded-lg shadow-sm'>
              Vous recevez
            </span>
            <span></span> {/* Colonne de séparation */}
            <span className='bg-white px-2 py-1 rounded-lg shadow-sm'>
              Vous envoyez
            </span>
          </div>

          <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,4fr)_minmax(0,2fr)_minmax(0,4fr)] gap-1 xl:gap-4 items-center'>
            {group.trades.map((match) => (
              <MatchItem
                key={match._id}
                match={match}
                isSelected={selectedMatchIds.includes(match._id)}
                onSelect={onToggleMatchSelection}
                sets={sets}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
