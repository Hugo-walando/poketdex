'use client';

interface CardSelectorProps {
  cardId: string;
  listedCardIds: string[];
  wishlistCardIds: string[];
  toggleListedCard: (id: string) => void;
  toggleWishlistCard: (id: string) => void;
}

export default function CardSelector({
  cardId,
  listedCardIds,
  wishlistCardIds,
  toggleListedCard,
  toggleWishlistCard,
}: CardSelectorProps) {
  return (
    <div className='flex gap-2 mt-4'>
      <button
        onClick={() => toggleListedCard(cardId)}
        className={`px-4 py-1 rounded-full text-sm font-medium border-2 transition-all duration-200 ${
          listedCardIds.includes(cardId)
            ? 'bg-primarygreen text-white border-primarygreen'
            : 'border-grayblue text-grayblue'
        }`}
      >
        Listed
      </button>

      <button
        onClick={() => toggleWishlistCard(cardId)}
        className={`px-4 py-1 rounded-full text-sm font-medium border-2 transition-all duration-200 ${
          wishlistCardIds.includes(cardId)
            ? 'bg-primarygreen text-white border-primarygreen'
            : 'border-grayblue text-grayblue'
        }`}
      >
        Wishlist
      </button>
    </div>
  );
}
