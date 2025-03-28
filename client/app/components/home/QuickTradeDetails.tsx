'use client';

import { mockSets } from '@/app/data/mockSets';
import { mockWishlists } from '@/app/data/mockWishlists';
import { ListedCard, Set } from '@/app/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import WishlistItem from './WishListItem';
import { cn } from '@/app/utils/cn';

interface Props {
  card: ListedCard;
  onClose: () => void;
}

const rarityIcons: Record<number, string> = {
  1: '/testimgs/rarities/1.png',
  2: '/testimgs/rarities/2.png',
  3: '/testimgs/rarities/3.png',
  4: '/testimgs/rarities/4.png',
  5: '/testimgs/rarities/5.png',
  6: '/testimgs/rarities/6.png',
  7: '/testimgs/rarities/7.png',
  8: '/testimgs/rarities/8.png',
};

export default function QuickTradeDetails({ card, onClose }: Props) {
  const [Sets, setSets] = useState<Set[]>([]);
  const [selectedWishlistCardId, setSelectedWishlistCardId] = useState<
    string | null
  >(null);

  const handleSendRequest = () => {
    if (!selectedWishlistCardId) return;

    console.log({
      toUserId: card.user.id,
      listedCardId: card.card.id,
      myCardOfferedId: selectedWishlistCardId,
    });
  };
  useEffect(() => {
    // Plus tard un fetch ici
    // fetch('/api/sets').then(...)

    setSets(mockSets); // pour l’instant on simule
  }, []);

  const cardSet = Sets.find((s) => s.id === card.card.set_id);

  return (
    <div className='p-4 rounded-xl h-full shadow-base bg-white'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-dark-xl'>Détails de la carte</h2>
        <button
          onClick={onClose}
          className='text-sm text-primarygreen underline hover:cursor-pointer'
        >
          Fermer
        </button>
      </div>

      <div className='w-full gap-3 flex justify-center'>
        <Image
          src={card.card.img_url}
          alt={card.card.name}
          width={0}
          height={0}
          sizes='100vw'
          className='h-40 w-auto shadow-base mb-4'
        />
        <div className='text-gray-xl'>
          {card.card.official_id}
          {cardSet && (
            <Image
              src={cardSet.img_url}
              alt={cardSet.name}
              width={0}
              height={0}
              sizes='100vw'
              className=' h-10 w-auto'
            />
          )}
          <Image
            src={rarityIcons[card.card.rarity]}
            alt={`Rareté ${card.card.rarity}`}
            width={0}
            height={0}
            sizes='100vw'
            className='mt-2 w-auto h-10'
          />
        </div>
      </div>

      <div className='flex items-center justify-center gap-2'>
        <Image
          src={card.user.profile_picture}
          alt={card.user.username}
          width={32}
          height={32}
          className='rounded-full'
        />
        <span className='text-dark-base'>{card.user.username}</span>
      </div>

      <h3 className='text-dark-xl mt-2 mb-2'>Il recherche :</h3>
      <div className='max-h-[20vh] overflow-y-auto'>
        <div className='grid grid-cols-[repeat(auto-fit,_minmax(80px,_1fr))] gap-3 p-2'>
          {mockWishlists.map((wish) => (
            <div
              key={wish.id}
              className='flex items-center justify-center hover:scale-110 transition-all hover:cursor-pointer'
            >
              <WishlistItem
                key={wish.id}
                card={wish}
                isSelected={selectedWishlistCardId === wish.id}
                onClick={setSelectedWishlistCardId}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSendRequest}
        disabled={!selectedWishlistCardId}
        className={cn(
          'w-full py-2 mt-6 rounded-xl font-semibold transition-all hover:cursor-pointer',
          selectedWishlistCardId
            ? 'bg-primarygreen text-white hover:opacity-90'
            : 'bg-gray-300 text-white cursor-not-allowed',
        )}
      >
        Envoyer la demande d`échange
      </button>
    </div>
  );
}
