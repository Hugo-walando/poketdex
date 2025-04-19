'use client';

import Image from 'next/image';
import { TradeRequest } from '@/app/types';
import TradeIcon from '../svgs/TradeIcon';
import { rarityIcons } from '@/app/data/rarities';
import { cn } from '@/app/utils/cn';

interface TradeItemProps {
  trade: TradeRequest;
  currentUserId: string;
}

export default function TradeItem({ trade, currentUserId }: TradeItemProps) {
  const isSender = trade.sender._id === currentUserId;

  return (
    <div
      className={cn(
        'bg-white rounded-xl p-2 xl:p-4 flex flex-col gap-2 transition-all shadow-base border-2',
        trade.is_active
          ? 'border-primarygreen ring-2 ring-primarygreen'
          : 'border-transparent',
      )}
    >
      {/* Badge échange actif */}
      {trade.is_active && (
        <span className='text-green-base mb-1'>Échange en cours</span>
      )}

      <div className='flex items-center justify-between'>
        {/* Vous recevez */}
        <div className='flex flex-col gap-1 lg:gap-2'>
          <span className='text-gray-base lg:text-gray-lg truncate'>
            Vous recevez
          </span>
          <div className='flex items-center gap-1 lg:gap-3'>
            <Image
              src={trade.card_requested.img_url}
              alt={trade.card_requested.name}
              width={0}
              height={0}
              sizes='100vw'
              className='h-26 sm:h-32 lg:h-36 w-auto'
            />
            <span className='text-dark-sm lg:text-dark-base'>
              {trade.card_requested.official_id}
            </span>
          </div>
        </div>

        {/* Icon et rareté */}
        <div className='flex flex-col items-center gap-1 lg:gap-2'>
          <TradeIcon className='text-sm w-6 h-6 lg:w-10 lg:h-10 text-primarygreen' />
          <Image
            src={
              rarityIcons[trade.card_offered.rarity as keyof typeof rarityIcons]
            }
            alt={`Rareté ${trade.card_offered.rarity}`}
            width={0}
            height={0}
            sizes='100vw'
            className='h-6 lg:h-10 w-auto object-contain'
          />
        </div>

        {/* Vous envoyez */}
        <div className='flex flex-col gap-1 lg:gap-2 items-end'>
          <span className='text-gray-base lg:text-gray-lg truncate'>
            Vous envoyez
          </span>
          <div className='flex items-center gap-1 lg:gap-3'>
            <span className='text-dark-sm lg:text-dark-base'>
              {trade.card_offered.official_id}
            </span>
            <Image
              src={trade.card_offered.img_url}
              alt={trade.card_offered.name}
              width={0}
              height={0}
              sizes='100vw'
              className='h-26 sm:h-32 lg:h-36 w-auto'
            />
          </div>
        </div>
      </div>

      {/* Status simple */}
      <div className='flex justify-between items-center text-gray-sm mt-2'>
        <span>
          {trade.status === 'pending' && 'En attente'}
          {trade.status === 'accepted' && 'Accepté ✅'}
          {trade.status === 'declined' && 'Refusé ❌'}
          {trade.status === 'cancelled' && 'Annulé 🚫'}
        </span>

        {/* Optionnel : affichage du rôle */}
        <span className='text-xs'>
          {isSender ? "(Vous êtes l'envoyeur)" : '(Vous êtes le receveur)'}
        </span>
      </div>
    </div>
  );
}
