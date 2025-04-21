'use client';

import Image from 'next/image';
import { TradeRequest } from '@/app/types';
import TradeIcon from '../svgs/TradeIcon';
import { rarityIcons } from '@/app/data/rarities';
import { cn } from '@/app/utils/cn';
import { useTradeRequestActions } from '@/app/hooks/useTradeRequestActions';
import { useState } from 'react';
import { useUserStore } from '@/app/store/useUserStore';

interface TradeItemProps {
  trade: TradeRequest;
  selectedUserId: string;
}

export default function TradeItem({ trade, selectedUserId }: TradeItemProps) {
  console.log('SelecetedUserId:', selectedUserId);
  console.log('senderId:', trade.sender._id);
  console.log('receiverId:', trade.receiver._id);
  const currentUserId = useUserStore((state) => state.user?.id);

  console.log('currentUserId:', currentUserId);
  const { acceptTradeRequest, declineTradeRequest } = useTradeRequestActions();
  const [loadingAction, setLoadingAction] = useState(false);

  const isSender = trade.sender._id === currentUserId;
  const isReceiver = trade.receiver._id === currentUserId;
  const isPending = trade.status === 'pending';

  const receivedCard = isSender ? trade.card_requested : trade.card_offered;
  const offeredCard = isSender ? trade.card_offered : trade.card_requested;

  const handleAccept = async () => {
    try {
      setLoadingAction(true);
      await acceptTradeRequest(trade._id);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDecline = async () => {
    try {
      setLoadingAction(true);
      await declineTradeRequest(trade._id);
    } finally {
      setLoadingAction(false);
    }
  };

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
              src={offeredCard.img_url}
              alt={offeredCard.name}
              width={0}
              height={0}
              sizes='100vw'
              className='h-26 sm:h-32 lg:h-36 w-auto'
            />
            <span className='text-dark-sm lg:text-dark-base'>
              {offeredCard.official_id}
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
              {receivedCard.official_id}
            </span>
            <Image
              src={receivedCard.img_url}
              alt={receivedCard.name}
              width={0}
              height={0}
              sizes='100vw'
              className='h-26 sm:h-32 lg:h-36 w-auto'
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className='flex justify-between items-center text-gray-sm mt-2'>
        <div className='flex flex-col gap-2'>
          <span>
            {trade.status === 'pending' && 'En attente'}
            {trade.status === 'accepted' && 'Accepté ✅'}
            {trade.status === 'declined' && 'Refusé ❌'}
            {trade.status === 'cancelled' && 'Annulé 🚫'}
          </span>

          {/* Si pending + receiver -> montrer les boutons */}
          {isReceiver && isPending && (
            <div className='flex gap-2 mt-2'>
              <button
                onClick={handleAccept}
                disabled={loadingAction}
                className='px-4 py-1 rounded-full bg-primarygreen text-white text-sm hover:opacity-90 transition'
              >
                {loadingAction ? '...' : 'Accepter'}
              </button>
              <button
                onClick={handleDecline}
                disabled={loadingAction}
                className='px-4 py-1 rounded-full bg-red-500 text-white text-sm hover:opacity-90 transition'
              >
                {loadingAction ? '...' : 'Refuser'}
              </button>
            </div>
          )}
        </div>

        {/* Optionnel : qui est qui */}
        <span className='text-xs'>
          {isSender ? "(Vous êtes l'envoyeur)" : '(Vous êtes le receveur)'}
        </span>
      </div>
    </div>
  );
}
