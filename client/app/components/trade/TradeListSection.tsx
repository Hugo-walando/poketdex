'use client';

import TradeItem from './TradeItem';
import { TradeRequest, User } from '@/app/types';
import CloseButton from '../ui/CloseButton';

interface TradeListSectionProps {
  selectedUser: User;
  trades: TradeRequest[];
  onBack: () => void;
}

export default function TradeListSection({
  selectedUser,
  trades,
  onBack,
}: TradeListSectionProps) {
  return (
    <>
      <h2 className='text-dark-xl mb-4 truncate px-2'>
        Demandes et Échanges avec {selectedUser.username}
      </h2>
      <section className='flex-1 p-1 xl:px-2 mb-2'>
        <CloseButton
          onClick={onBack}
          className='fixed scale-200 bottom-30 z-50 left-1/2 -translate-x-1/2 md:hidden'
        />
        <div className='space-y-4'>
          {trades.map((trade) => (
            <TradeItem
              key={trade._id}
              trade={trade}
              currentUserId={selectedUser.id}
            />
          ))}
        </div>
      </section>
    </>
  );
}
