'use client';

import Image from 'next/image';
import { Trade } from '@/app/types'; // à adapter selon l'interface

interface TradeItemProps {
  trade: Trade;
}

export default function TradeItem({ trade }: TradeItemProps) {
  return (
    <div className='bg-white shadow-base rounded-xl p-4 flex flex-col gap-2'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Image
            src={trade.offered_card.img_url}
            alt={trade.offered_card.name}
            width={60}
            height={90}
            className='rounded-md'
          />
          <span className='text-sm text-darkblue font-semibold'>
            {trade.offered_card.official_id}
          </span>
        </div>

        <span className='text-primarygreen font-bold text-xl'>⇄</span>

        <div className='flex items-center gap-3'>
          <Image
            src={trade.requested_card.img_url}
            alt={trade.requested_card.name}
            width={60}
            height={90}
            className='rounded-md'
          />
          <span className='text-sm text-darkblue font-semibold'>
            {trade.requested_card.official_id}
          </span>
        </div>
      </div>

      <div className='flex justify-between items-center text-gray-sm mt-2'>
        <span>
          État :{' '}
          <span className='font-semibold text-darkgray'>
            {trade.status === 'pending'
              ? 'En attente'
              : trade.status === 'accepted'
              ? 'Accepté'
              : trade.status === 'cancelled'
              ? 'Annulé'
              : 'Inconnu'}
          </span>
        </span>

        {/* Placeholder action rapide à adapter plus tard */}
        <button className='text-sm text-primarygreen underline hover:opacity-70'>
          Marquer comme envoyé
        </button>
      </div>
    </div>
  );
}
