'use client';

interface CardSelectorProps {
  cardId: string;
  ownedCards: string[];
  wishlist: string[];
  toggleOwned: (id: string) => void;
  toggleWishlist: (id: string) => void;
}

export default function CardSelector({
  cardId,
  ownedCards,
  wishlist,
  toggleOwned,
  toggleWishlist,
}: CardSelectorProps) {
  return (
    <div className='flex gap-2 mt-4'>
      <button
        onClick={() => toggleOwned(cardId)}
        className={`px-4 py-1 rounded-full text-sm font-medium border-2 transition-all duration-200 ${
          ownedCards.includes(cardId)
            ? 'bg-primarygreen text-white border-primarygreen'
            : 'border-grayblue text-grayblue'
        }`}
      >
        {ownedCards.includes(cardId) ? 'Yes' : 'Yes'}
      </button>

      <button
        onClick={() => toggleWishlist(cardId)}
        className={`px-4 py-1 rounded-full text-sm font-medium border-2 transition-all duration-200 ${
          wishlist.includes(cardId)
            ? 'bg-primarygreen text-white border-primarygreen'
            : 'border-grayblue text-grayblue'
        }`}
      >
        {wishlist.includes(cardId) ? 'Want' : 'Want'}
      </button>
    </div>
  );
}
