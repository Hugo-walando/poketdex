'use client';

import TradeIcon from '../svgs/TradeIcon';
import { HeartIcon } from 'lucide-react';

interface CardPageFiltersProps {
  listedCount: number;
  wishlistCount: number;
  filter: 'all' | 'listed' | 'wishlist';
  setFilter: (value: 'all' | 'listed' | 'wishlist') => void;
}

export default function CardsFilters({
  listedCount,
  wishlistCount,
  filter,
  setFilter,
}: CardPageFiltersProps) {
  return (
    <div className='flex gap-4 items-center'>
      <button
        onClick={() => setFilter(filter === 'listed' ? 'all' : 'listed')}
        className={`flex items-center gap-1 px-2 py-1 rounded-xl shadow-base transition hover:cursor-pointer ${
          filter === 'listed'
            ? 'bg-darkgray inset-shadow-field text-white'
            : 'bg-white text-darkblue'
        }`}
      >
        <TradeIcon className='w-6 h-6 fill-primarygreen shrink-0' />

        <span className='text-sm font-poppins'>{listedCount}00</span>
      </button>

      <button
        onClick={() => setFilter(filter === 'wishlist' ? 'all' : 'wishlist')}
        className={`flex items-center gap-1 px-2 py-1 rounded-xl shadow-base transition hover:cursor-pointer ${
          filter === 'wishlist'
            ? 'bg-darkgray inset-shadow-field text-white '
            : 'bg-white text-darkblue'
        }`}
      >
        <HeartIcon className='w-6 h-6 fill-pink-400 text-transparent shrink-0' />
        <span className='text-sm font-poppins'>{wishlistCount}00</span>
      </button>
    </div>
  );
}
