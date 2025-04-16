'use client';

import { mockSets } from '@/app/data/mockSets';
import { mockWishlists } from '@/app/data/mockWishlists';
import { ListedCard, Set } from '@/app/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import WishlistItem from './WishListItem';
import { cn } from '@/app/utils/cn';
import { rarityIcons } from '@/app/data/rarities';
import CloseButton from '../ui/CloseButton';

interface Props {
  card: ListedCard;
  onClose: () => void;
}

export default function QuickTradeDetails({ card, onClose }: Props) {
  const [Sets, setSets] = useState<Set[]>([]);
  const [selectedWishlistCardId, setSelectedWishlistCardId] = useState<
    string | null
  >(null);

  const handleSendRequest = () => {
    if (!selectedWishlistCardId) return;

    console.log({
      toUserId: card.user.id,
      listedCardId: card.card._id,
      myCardOfferedId: selectedWishlistCardId,
    });
  };
  useEffect(() => {
    // Plus tard un fetch ici
    // fetch('/api/sets').then(...)
    console.log('fetch QuickeTradeDetails');

    setSets(mockSets); // pour l’instant on simule
  }, []);

  const cardSet = Sets.find((s) => s.id === card.card.set_code);

  return (
    <div className='p-4 rounded-xl'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-dark-xl'>Détails de la carte</h2>
        <CloseButton onClick={onClose} />
      </div>

      <div className='w-full gap-3 flex justify-center'>
        <div className='w-1/2 flex justify-end'>
          <Image
            src={card.card.img_url}
            alt={card.card.name}
            width={0}
            height={0}
            sizes='100vw'
            className='h-34 w-auto shadow-base mb-4'
          />
        </div>
        <div className='w-1/2 flex justify-start'>
          <div className='text-gray-xl'>
            {card.card.official_id}
            {cardSet && (
              <Image
                src={cardSet.img_url}
                alt={cardSet.name}
                width={0}
                height={0}
                sizes='100vw'
                className='h-8 w-auto'
              />
            )}
            <Image
              src={rarityIcons[card.card.rarity as keyof typeof rarityIcons]}
              alt={`Rareté ${card.card.rarity}`}
              width={0}
              height={0}
              sizes='100vw'
              className='mt-2 w-auto h-8'
            />
          </div>
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

      <h3 className='text-dark-xl my-1'>
        {card.user.username} voudrait ces cartes:{' '}
      </h3>
      <div className='max-h-[20vh] overflow-y-auto'>
        <div className='grid grid-cols-[repeat(auto-fit,_minmax(80px,_1fr))] gap-3 p-2'>
          {mockWishlists.map((wish) => (
            <div
              key={wish._id}
              className='flex items-center justify-center hover:scale-110 transition-all hover:cursor-pointer'
            >
              <WishlistItem
                key={wish._id}
                card={wish}
                isSelected={selectedWishlistCardId === wish._id}
                onClick={setSelectedWishlistCardId}
              />
            </div>
          ))}
        </div>
      </div>
      {!selectedWishlistCardId && (
        <p className='text-light-sm text-center my-2'>
          Veuillez sélectionner une carte à proposer en échange.
        </p>
      )}

      <button
        onClick={handleSendRequest}
        disabled={!selectedWishlistCardId}
        className={cn(
          'w-full py-2 rounded-xl font-semibold ',
          selectedWishlistCardId
            ? 'bg-primarygreen text-white hover:opacity-90 mt-9 hover:cursor-pointer'
            : 'bg-gray-300 text-white cursor-not-allowed',
        )}
      >
        Envoyer la demande d`échange
      </button>
    </div>
  );
}
