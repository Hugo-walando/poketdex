'use client';

import TradeItem from './TradeItem';
import { TradeRequest, AppUser } from '@/app/types';
import CloseButton from '../ui/CloseButton';

interface TradeListSectionProps {
  selectedUser: AppUser;
  trades: TradeRequest[];
  onBack: () => void;
}

const sortTradesByStatusAndDate = (trades: TradeRequest[]) => {
  return [...trades].sort((a, b) => {
    // 1. Priorité aux "pending"
    if (a.is_active && !b.is_active) return -1;
    if (!a.is_active && b.is_active) return 1;
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;

    // 2. Ensuite, actifs avant inactifs

    // 3. Sinon, tri par date décroissante
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

export default function TradeListSection({
  selectedUser,
  trades,
  onBack,
}: TradeListSectionProps) {
  return (
    <>
      <h2 className='text-dark-xl mb-4 truncate px-2'>
        Échanges avec {selectedUser.username}{' '}
        <span className='text-gray-xl'>({trades.length})</span>
      </h2>
      <section className='flex-1 p-1 xl:px-2 mb-20 '>
        <CloseButton
          onClick={onBack}
          className='fixed scale-150 bottom-30 z-50 left-1/2 -translate-x-1/2 md:hidden'
        />
        <div className='space-y-4 pb-2 mt-5 md:mt-0'>
          {sortTradesByStatusAndDate(trades).map((trade) => (
            <TradeItem
              key={trade._id}
              trade={trade}
              selectedUserId={selectedUser._id}
            />
          ))}
        </div>
      </section>
    </>
  );
}
