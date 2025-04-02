'use client';

import { mockTrades } from '@/app/data/mockTrades';
import TradeItem from './TradeItem';
import { User } from '@/app/types';

interface TradeListSectionProps {
  selectedUser: User;
  onBack: () => void;
}

export default function TradeListSection({
  selectedUser,
  onBack,
}: TradeListSectionProps) {
  return (
    <section className='flex-1 px-4'>
      <button onClick={onBack}>Back</button>
      <h2 className='text-dark-xl mb-4'>Demandes et Échanges</h2>
      <span className='text-gray-base mb-4'>{selectedUser.username}</span>
      <div className='space-y-4'>
        {mockTrades.map((trade) => (
          <TradeItem
            key={trade.id}
            trade={trade}
            currentUserId={selectedUser.id}
          />
        ))}
      </div>
    </section>
  );
}
