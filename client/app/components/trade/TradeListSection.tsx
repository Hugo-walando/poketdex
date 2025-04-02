'use client';

import { mockTrades } from '@/app/data/mockTrades';
import TradeItem from './TradeItem';

export default function TradeListSection() {
  return (
    <section className='flex-1 px-4 py-6'>
      <h2 className='text-dark-xl mb-4'>Demandes et Échanges</h2>
      <div className='space-y-4'>
        {mockTrades.map((trade) => (
          <TradeItem key={trade.id} trade={trade} />
        ))}
      </div>
    </section>
  );
}
