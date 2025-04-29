'use client';

import { MatchTrade, Set } from '@/app/types';
import Image from 'next/image';
import { CheckCircle, Circle } from 'lucide-react';
import TradeIcon from '../svgs/TradeIcon';
import { rarityIcons } from '@/app/data/rarities';
import { cn } from '@/app/utils/cn'; // si tu as un utilitaire cn()

interface Props {
  match: MatchTrade;
  isSelected: boolean;
  onSelect: (matchId: string) => void;
  sets: Set[];
}

export default function MatchItem({
  match,
  isSelected,
  onSelect,
  sets,
}: Props) {
  const requestedCardSet = sets.find(
    (s) => s.code === match.requested_card.set_code,
  );
  const offeredCardSet = sets.find(
    (s) => s.code === match.offered_card.set_code,
  );

  return (
    <div
      onClick={() => onSelect(match._id)}
      className={cn(
        'col-span-4 grid grid-cols-[minmax(0,1fr)_minmax(0,4fr)_minmax(0,2fr)_minmax(0,4fr)] gap-1 xl:gap-4 items-center p-2 rounded-lg cursor-pointer transition hover:bg-gray-100',
        isSelected && 'bg-primarygreen/10  hover:bg-primarygreen/20',
      )}
    >
      {/* Checkbox remplacée par icônes */}
      <div className='flex justify-center'>
        {isSelected ? (
          <CheckCircle className='text-primarygreen w-10 h-10' />
        ) : (
          <Circle className='text-gray-400 w-10 h-10' />
        )}
      </div>

      {/* Requested Card */}
      <div className='flex items-center gap-2'>
        <Image
          src={match.requested_card.img_url}
          alt={match.requested_card.name}
          width={0}
          height={0}
          sizes='100vw'
          className='h-22 w-auto'
        />
        <div className='flex flex-col gap-2 w-full'>
          <span className='text-gray-sm'>
            {match.requested_card.official_id}
          </span>
          {requestedCardSet && (
            <Image
              src={requestedCardSet.img_url}
              alt={requestedCardSet.name}
              width={0}
              height={0}
              sizes='100vw'
              className='h-auto w-16 object-contain'
            />
          )}
        </div>
      </div>

      {/* Trade Icon + Rarity */}
      <div className='flex flex-col items-center w-full gap-1 mx-auto'>
        <TradeIcon className='w-6 h-6 text-primarygreen' />
        <Image
          src={
            rarityIcons[match.offered_card.rarity as keyof typeof rarityIcons]
          }
          alt={`Rareté ${match.offered_card.rarity}`}
          width={0}
          height={0}
          sizes='100vw'
          className='h-5 w-auto object-contain'
        />
      </div>

      {/* Offered Card */}
      <div className='flex items-center gap-2'>
        <div className='flex flex-col gap-2 w-full'>
          <span className='text-gray-sm text-right'>
            {match.offered_card.official_id}
          </span>
          {offeredCardSet && (
            <Image
              src={offeredCardSet.img_url}
              alt={offeredCardSet.name}
              width={0}
              height={0}
              sizes='100vw'
              className='h-auto w-16 object-contain'
            />
          )}
        </div>
        <Image
          src={match.offered_card.img_url}
          alt={match.offered_card.name}
          width={0}
          height={0}
          sizes='100vw'
          className='h-22 w-auto'
        />
      </div>
    </div>
  );
}
