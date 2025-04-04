'use client';

import { MatchTrade, Set } from '@/app/types';
import Image from 'next/image';
import TradeIcon from '../svgs/TradeIcon';
import { useEffect, useState } from 'react';
import { mockSets } from '@/app/data/mockSets';
import { rarityIcons } from '@/app/data/rarities';

interface Props {
  match: MatchTrade;
  isSelected: boolean;
  onSelect: (matchId: string) => void;
}

export default function MatchItem({ match, isSelected, onSelect }: Props) {
  const [Sets, setSets] = useState<Set[]>([]);

  useEffect(() => {
    // Plus tard un fetch ici
    // fetch('/api/sets').then(...)

    setSets(mockSets); // pour l’instant on simule
  }, []);

  const requestedCardSet = Sets.find(
    (s) => s.id === match.requested_card.set_id,
  );
  const offeredCardSet = Sets.find((s) => s.id === match.offered_card.set_id);

  return (
    <>
      {/* Input */}
      <input
        type='checkbox'
        checked={isSelected}
        onChange={() => onSelect(match.id)}
        className='w-4 h-4 accent-primarygreen'
      />
      {/* Requested Card */}
      <div className='flex items-center gap-2 '>
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
              className='h-5 w-auto object-contain'
            />
          )}
        </div>
      </div>
      {/* Icon & Rarity */}
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
      <div className='flex items-center gap-2 '>
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
              className=' h-5 w-auto object-contain'
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
    </>
  );
}
