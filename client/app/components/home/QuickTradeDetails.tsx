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
    <div className='md:p-4 rounded-xl mb-56 md:mb-0 relative'>
      <div className='flex items-center justify-between mb-4 sticky top-4 right-4'>
        <h2 className='text-dark-xl rounded-full bg-white/50 px-2 py-0.5 backdrop-blur-sm'>
          Détails de la carte proposée
        </h2>
        <CloseButton onClick={onClose} className='hidden md:block ' />
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
      <div className='flex items-center justify-center gap-2'>
        <Image
          src={card.user.profile_picture || '/avatars/Av1.png'}
          alt={card.user.username}
          width={32}
          height={32}
          className='rounded-full'
        />
        <span className='text-dark-base '>{card.user.username}</span>
      </div>

      <h3 className='text-dark-xl my-1'>
        {card.user.username} voudrait ces cartes:{' '}
      </h3>
      <div className='relative'>
        {/* Zone scrollable */}
        <div ref={scrollRef} className='overflow-y-auto pr-1'>
          <div
            className={cn(
              'gap-2 p-2 overflow-hidden',
              wishlistCards.length <= 3
                ? 'flex gap-6 justify-center'
                : 'grid grid-cols-[repeat(auto-fit,_minmax(80px,_1fr))]',
            )}
          >
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

      <div className='fixed bottom-40 md:sticky md:bottom-2 left-1/2 z-50 -translate-x-1/2 md:translate-x-0 w-full flex flex-col items-center px-6 text-center'>
        {!selectedCardId && (
          <p className='text-light-sm text-center bg-white/50 backdrop-blur-sm p-1 rounded-lg'>
            Veuillez sélectionner une carte à proposer en échange.
          </p>
        )}

        <button
          onClick={handleSendRequest}
          disabled={!selectedCardId || loadingTrade}
          className={cn(
            'w-full py-2 rounded-xl font-semibold flex items-center justify-center gap-2',
            selectedCardId && !loadingTrade
              ? 'bg-primarygreen text-white hover:opacity-90 hover:cursor-pointer'
              : 'bg-gray-300 text-white cursor-not-allowed',
          )}
        >
          {loadingTrade && (
            <Loader2 className='animate-spin w-5 h-5 text-white' />
          )}
          {loadingTrade ? 'Envoi en cours...' : 'Envoyer la demande d’échange'}
        </button>
      </div>
      <div className='h-6 bg-gradient-to-b from-white/0 to-white/100 fixed md:sticky bottom-22 md:bottom-0 z-20 left-1/2 -translate-x-1/2 md:translate-x-0 w-full'></div>

      <CloseButton
        onClick={onClose}
        className='scale-150 z-50 md:hidden mt-5 mx-auto fixed bottom-28 left-1/2 -translate-x-1/2'
      />
    </div>
  );
}
