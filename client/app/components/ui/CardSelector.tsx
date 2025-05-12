'use client';

import { HeartIcon } from 'lucide-react';
import TradeIcon from '../svgs/TradeIcon';

interface CardSelectorProps {
  cardId: string;
  isListed: boolean;
  isWishlisted: boolean;
  toggleListedCard: (id: string) => void;
  toggleWishlistCard: (id: string) => void;
}

export default function CardSelector({
  cardId,
  isListed,
  isWishlisted,
  toggleListedCard,
  toggleWishlistCard,
}: CardSelectorProps) {
  return (
    <div className='flex gap-2 w-full bg-white/90 backdrop-blur-lg rounded-md h-12 absolute bottom-0'>
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
