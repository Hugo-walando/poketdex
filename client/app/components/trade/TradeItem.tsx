'use client';

import Image from 'next/image';
import { TradeRequest } from '@/app/types';
import TradeIcon from '../svgs/TradeIcon';
import { rarityIcons } from '@/app/data/rarities';
import { cn } from '@/app/utils/cn';
import { useState } from 'react';

interface TradeItemProps {
  trade: TradeRequest;
  currentUserId: string;
}

export default function TradeItem({ trade, currentUserId }: TradeItemProps) {
  // Logique d’état côté front (à remplacer plus tard par le backend)
  const [sentByMe, setSentByMe] = useState(
    trade.sender_id === currentUserId
      ? trade.sent_by_sender
      : trade.sent_by_receiver,
  );
  const sentByOther =
    trade.sender_id === currentUserId
      ? trade.sent_by_receiver
      : trade.sent_by_sender;

  const handleMarkAsSent = () => {
    // Plus tard : requête vers le backend ici
    setSentByMe(true);
    console.log('Carte marquée comme envoyée');
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl p-4 flex flex-col gap-2 transition-all shadow-base border-2',
        trade.is_active
          ? 'border-primarygreen ring-2 ring-primarygreen'
          : 'border-transparent',
      )}
    >
      {/* Cartes échange */}
      {trade.is_active && (
        <span className='text-green-base  mb-1'>Échange en cours</span>
      )}
      <div className='flex items-center justify-between'>
        {/* Vous recevez */}
        <div className='flex flex-col gap-2'>
          <span className='text-gray-base lg:text-gray-lg'>Vous recevez</span>
          <div className='flex items-center gap-3'>
            <Image
              src={trade.requested_card.img_url}
              alt={trade.requested_card.name}
              width={0}
              height={0}
              sizes='100vw'
              className='md:h-26 lg:h-32 w-auto'
            />
            <span className='text-dark-sm lg:text-dark-base'>
              {trade.requested_card.official_id}
            </span>
          </div>
        </div>

        {/* Icon et rareté */}
        <div className='flex flex-col items-center gap-2'>
          <TradeIcon className='text-sm w-10 h-10 md:w-6 md:h-6 lg:w-10 lg:h-10 text-primarygreen' />
          <Image
            src={
              rarityIcons[trade.offered_card.rarity as keyof typeof rarityIcons]
            }
            alt={`Rareté ${trade.offered_card.rarity}`}
            width={0}
            height={0}
            sizes='100vw'
            className='h-6 lg:h-10 w-auto object-contain'
          />
        </div>

        {/* Vous envoyez */}
        <div className='flex flex-col gap-2 items-end'>
          <span className='text-gray-base lg:text-gray-lg'>Vous envoyez</span>
          <div className='flex items-center gap-3'>
            <span className='text-dark-sm lg:text-dark-base'>
              {trade.offered_card.official_id}
            </span>
            <Image
              src={trade.offered_card.img_url}
              alt={trade.offered_card.name}
              width={0}
              height={0}
              sizes='100vw'
              className='md:h-26 lg:h-32 w-auto'
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className='flex justify-between items-center text-gray-sm'>
        <div className='flex items-center gap-2'>
          <div
            className={cn(
              'w-3 h-3 rounded-full',
              sentByOther ? 'bg-primarygreen' : 'bg-gray-300',
            )}
          />
          <span className='text-sm'>
            {sentByOther ? 'A envoyé sa carte' : 'En attente'}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={handleMarkAsSent}
            disabled={sentByMe}
            className={cn(
              'text-sm px-3 py-1 rounded-full font-semibold transition-all',
              sentByMe
                ? 'bg-primarygreen text-white cursor-default'
                : 'bg-gray-100 text-darkgray hover:bg-gray-200',
            )}
          >
            {sentByMe ? '✔️ Envoyée' : 'Marquer comme envoyée'}
          </button>
        </div>
      </div>
    </div>
  );
}
