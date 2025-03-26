'use client';

import { ListedCard } from '@/app/types';
import Image from 'next/image';

interface Props {
  card: ListedCard;
  onClose: () => void;
}

export default function QuickTradeDetails({ card, onClose }: Props) {
  const wishlistMock = [
    {
      id: '101',
      name: 'Dracaufeu',
      img_url: '/testimgs/cards/DracaufeuEx.png',
    },
    {
      id: '102',
      name: 'Palkia',
      img_url: '/testimgs/cards/PalkiaEx.png',
    },
  ];

  return (
    <div className='p-4 rounded-xl shadow-base bg-white'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-dark-xl'>Détails de la carte</h2>
        <button
          onClick={onClose}
          className='text-sm text-primarygreen underline hover:cursor-pointer'
        >
          Fermer
        </button>
      </div>

      <Image
        src={card.card.img_url}
        alt={card.card.name}
        width={200}
        height={260}
        className='mx-auto rounded-xl shadow-base mb-4'
      />

      <div className='text-center text-dark-xl font-bold mb-2'>
        {card.card.name}
      </div>
      <div className='text-center text-gray-base mb-4'>
        ID : {card.card.official_id}
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

      <h3 className='text-dark-xl mt-6 mb-2'>Il recherche :</h3>
      <div className='grid grid-cols-2 gap-3'>
        {wishlistMock.map((wish) => (
          <div key={wish.id} className='rounded-xl bg-gray-100 p-2 shadow-sm'>
            <Image
              src={wish.img_url}
              alt={wish.name}
              width={100}
              height={130}
              className='mx-auto'
            />
            <p className='text-center text-sm mt-1'>{wish.name}</p>
          </div>
        ))}
      </div>

      <button className='mt-6 w-full bg-primarygreen text-white py-2 rounded-xl hover:opacity-90 transition-all'>
        Envoyer une demande d’échange
      </button>
    </div>
  );
}
