'use client';

import { HeartIcon, Minus, Plus } from 'lucide-react';
import TradeIcon from '../svgs/TradeIcon';

interface CardSelectorProps {
  cardId: string;
  quantity: number;
  isListed: boolean;
  isWishlisted: boolean;
  toggleListedCard: (id: string) => void;
  toggleWishlistCard: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
}

export default function CardSelector({
  cardId,
  quantity,
  isListed,
  isWishlisted,
  toggleListedCard,
  toggleWishlistCard,
  increment,
  decrement,
}: CardSelectorProps) {
  return (
    <div className='flex w-full bg-white/90 backdrop-blur-lg rounded-md h-12 absolute bottom-0'>
      {/* ➖ Bouton décrémenter */}
      {isListed && (
        <div className='flex items-center justify-center rounded-md absolute left-0 top-[-22] bg-darkblue/90'>
          <button
            onClick={() => decrement(cardId)}
            disabled={!isListed}
            className='p-1 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:cursor-pointer'
          >
            <Minus className='w-4 h-4' />
          </button>

          {/* Quantité */}
          {isListed && (
            <div className='text-xs font-semibold text-white w-[15px] text-center'>
              {quantity}
            </div>
          )}

          {/* ➕ Bouton incrémenter */}
          <button
            onClick={() => increment(cardId)}
            disabled={!isListed}
            className='p-1 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:cursor-pointer'
          >
            <Plus className='w-4 h-4' />
          </button>
        </div>
      )}

      <button
        onClick={() => toggleListedCard(cardId)}
        className={`p-2 lg:p-3  text-grayblue w-full transition-all duration-200 hover:cursor-pointer flex items-center justify-center`}
      >
        <TradeIcon
          className={`w-8 h-8 ${isListed ? 'fill-primarygreen' : ' text-grayblue'}`}
        />
      </button>

      <button
        onClick={() => toggleWishlistCard(cardId)}
        className={`p-2 lg:p-3  text-grayblue w-full transition-all duration-200 hover:cursor-pointer  flex items-center justify-center`}
      >
        <HeartIcon
          className={`w-8 h-8 transition-all duration-200 ${isWishlisted ? 'fill-pink-400 text-transparent' : 'fill-transparent text-grayblue'}`}
        />
      </button>
    </div>
  );
}
