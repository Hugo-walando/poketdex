'use client';

import { ListedCard } from '@/app/types';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import WishlistItem from './WishListItem';
import { cn } from '@/app/utils/cn';
import { rarityIcons } from '@/app/data/rarities';
import CloseButton from '../ui/CloseButton';
import useFetchWishlistForQuickTrade from '@/app/hooks/useFetchWishlistForQuickTrade';
import { useRouter } from 'next/navigation';
import useCreateQuickTrade from '@/app/hooks/useCreateQuickTrade';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useGlobalData } from '@/app/store/useGlobalData';

interface Props {
  card: ListedCard;
  onClose: () => void;
}

export default function QuickTradeDetails({ card, onClose }: Props) {
  const sets = useGlobalData((s) => s.sets);
  const cardSet = sets.find((set) => set.code === card.card.set_code);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const router = useRouter();

  const { createQuickTrade, loading: loadingTrade } = useCreateQuickTrade();

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const { wishlistCards, loading: loadingWishlist } =
    useFetchWishlistForQuickTrade(card.user._id, card.card.rarity);
  const handleSendRequest = async () => {
    if (!selectedCardId) return;
    const result = await createQuickTrade({
      listedCardId: card.card._id,
      myCardOfferedId: selectedCardId,
      toUserId: card.user._id,
    });
    if (result) {
      router.push(`/trades?user=${card.user._id}`);
    }
  };

  useEffect(() => {
    setSelectedCardId(null);
  }, [card]);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const hasOverflow = el.scrollHeight > el.clientHeight;
      setIsOverflowing(hasOverflow);
    }
  }, [wishlistCards]);

  if (loadingWishlist) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-gray-xl'>Chargement...</p>
      </div>
    );
  }

  return (
    <div className='md:p-4 rounded-xl'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-dark-xl'>Détails de la carte</h2>
        <CloseButton onClick={onClose} className='hidden md:block' />
      </div>

      <div className='w-full flex justify-center gap-2'>
        <div className='flex items-start justify-center gap-2'>
          <Image
            src={card.user.profile_picture || '/avatars/Av1.png'}
            alt={card.user.username}
            width={32}
            height={32}
            className='rounded-full'
          />
          <span className='text-dark-base '>{card.user.username}</span>
        </div>
        <div className=' gap-3 flex justify-center'>
          <div className='flex justify-end'>
            <Image
              src={card.card.img_url}
              alt={card.card.name}
              width={0}
              height={0}
              sizes='100vw'
              className='h-34 w-auto shadow-base mb-4'
            />
          </div>
          <div className=' flex justify-start'>
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
      </div>

      <h3 className='text-dark-xl my-1'>
        {card.user.username} voudrait ces cartes:{' '}
      </h3>
      <div className='relative'>
        {/* Zone scrollable */}
        <div ref={scrollRef} className='max-h-[26vh] overflow-y-auto pr-1'>
          <div className='grid grid-cols-[repeat(auto-fit,_minmax(80px,_1fr))] gap-2 p-2 overflow-hidden'>
            {wishlistCards.map((wish) => (
              <div
                key={wish._id}
                className='flex items-center justify-center hover:scale-110 transition-all hover:cursor-pointer'
              >
                <WishlistItem
                  card={wish}
                  isSelected={selectedCardId === wish.card._id}
                  onClick={setSelectedCardId}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Flèche de scroll */}
        {isOverflowing && (
          <div className='absolute bottom-0 left-0 w-full flex justify-center pointer-events-none'>
            <div className='animate-bounce text-gray-500 text-lg pb-2'>
              <ChevronDown />
            </div>
          </div>
        )}
      </div>
      {!selectedCardId && (
        <p className='text-light-sm text-center my-2'>
          Veuillez sélectionner une carte à proposer en échange.
        </p>
      )}

      <button
        onClick={handleSendRequest}
        disabled={!selectedCardId || loadingTrade}
        className={cn(
          'w-full py-2 rounded-xl font-semibold flex items-center justify-center gap-2',
          selectedCardId && !loadingTrade
            ? 'bg-primarygreen text-white hover:opacity-90 mt-9 hover:cursor-pointer'
            : 'bg-gray-300 text-white cursor-not-allowed',
        )}
      >
        {loadingTrade && (
          <Loader2 className='animate-spin w-5 h-5 text-white' />
        )}
        {loadingTrade ? 'Envoi en cours...' : 'Envoyer la demande d’échange'}
      </button>
      <CloseButton
        onClick={onClose}
        className='fixed scale-200 bottom-30 z-50 left-1/2 -translate-x-1/2 md:hidden'
      />
    </div>
  );
}
