'use client';

import Image from 'next/image';
import { TradeRequest } from '@/app/types';
import TradeIcon from '../svgs/TradeIcon';
import { rarityIcons } from '@/app/data/rarities';
import { cn } from '@/app/utils/cn';
import { useTradeRequestActions } from '@/app/hooks/useTradeRequestActions';
import { useState } from 'react';
import { useUserStore } from '@/app/store/useUserStore';
import { CheckCircle } from 'lucide-react';

interface TradeItemProps {
  trade: TradeRequest;
  selectedUserId: string;
}

export default function TradeItem({ trade, selectedUserId }: TradeItemProps) {
  console.log('Selected user ID:', selectedUserId);
  const currentUserId = useUserStore((state) => state.user?.id);
  const { acceptTradeRequest, declineTradeRequest, markTradeRequestAsSent } =
    useTradeRequestActions();
  const [loadingAction, setLoadingAction] = useState(false);
  const [loadingMarkSent, setLoadingMarkSent] = useState(false);

  const isSender = trade.sender._id === currentUserId;
  const isReceiver = trade.receiver._id === currentUserId;
  const isPending = trade.status === 'pending';
  const isCompleted = trade.status === 'completed';

  const receivedCard = isSender ? trade.card_requested : trade.card_offered;
  const offeredCard = isSender ? trade.card_offered : trade.card_requested;

  const sentByMe = isSender ? trade.sent_by_sender : trade.sent_by_receiver;
  const sentByOther = isSender ? trade.sent_by_receiver : trade.sent_by_sender;

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

  const handleMarkAsSent = async () => {
    try {
      setLoadingMarkSent(true);
      await markTradeRequestAsSent(trade._id);
    } finally {
      setLoadingMarkSent(false);
    }
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl p-2 xl:p-4 flex flex-col gap-2 transition-all shadow-base border-2 relative',
        trade.is_active
          ? 'border-primarygreen ring-2 ring-primarygreen'
          : 'border-transparent',
      )}
    >
      {/* Badge échange actif */}
      {trade.is_active && (
        <span className='text-green-base mb-1'>Échange en cours</span>
      )}

      {isCompleted && (
        <div className='absolute inset-0 bg-primarygreen/20 flex items-start justify-start p-2 z-10 rounded-xl'>
          <div className='absolute bg-white rounded-xl p-3 flex items-center justify-center gap-3'>
            <span className='text-green-base text-lg font-bold'>
              Échange complété
            </span>
            <CheckCircle className='text-primarygreen w-8 h-8' />
          </div>
        </div>
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

          {/* Si accepté → montrer "Marquer comme envoyé" */}
          {trade.status === 'accepted' && !sentByMe && (
            <div className='flex gap-2 mt-2'>
              <button
                onClick={handleMarkAsSent}
                disabled={loadingMarkSent}
                className='px-4 py-1 rounded-full bg-gray-200 text-dark text-sm hover:bg-gray-300 transition'
              >
                {loadingMarkSent ? '...' : 'Marquer ma carte comme envoyée'}
              </button>
            </div>
          )}

          {/* Status carte envoyée */}
          {trade.status === 'accepted' && (
            <div className='flex flex-col text-xs gap-1 mt-2'>
              <div>
                Vous :{' '}
                {sentByMe ? (
                  <span className='text-green-600'>✔️ Envoyée</span>
                ) : (
                  <span className='text-gray-500'>❌ Non envoyée</span>
                )}
              </div>
              <div>
                {isSender ? 'Receveur' : 'Envoyeur'} :{' '}
                {sentByOther ? (
                  <span className='text-green-600'>✔️ Envoyée</span>
                ) : (
                  <span className='text-gray-500'>❌ Non envoyée</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Qui est qui */}
        <span className='text-xs'>
          {isSender ? "(Vous êtes l'envoyeur)" : '(Vous êtes le receveur)'}
        </span>
      </div>
    </div>
  );
}
