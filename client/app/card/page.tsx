'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import CardSelector from '../components/ui/CardSelector';

interface Card {
  id: string;
  name: string;
  img_url: string;
  rarity: number;
  official_id: string;
  created_at: string;
  updated_at: string;
}

const mockCards: Card[] = [
  {
    id: '1',
    name: 'Pikachu',
    img_url: '/testimgs/PikachuEx.png',
    rarity: 4,
    official_id: '113/226',
    created_at: '2024-03-01',
    updated_at: '2024-03-01',
  },
  {
    id: '2',
    name: 'Dracaufeu',
    img_url: '/testimgs/DracaufeuEx.png',
    rarity: 4,
    official_id: '034/226',
    created_at: '2024-03-01',
    updated_at: '2024-03-01',
  },
  {
    id: '3',
    name: 'Palkia',
    img_url: '/testimgs/PalkiaEx.png',
    rarity: 4,
    official_id: '123/178',
    created_at: '2024-03-01',
    updated_at: '2024-03-01',
  },
  {
    id: '4',
    name: 'Amonistar',
    img_url: '/testimgs/Amonistar.png',
    rarity: 3,
    official_id: '012/178',
    created_at: '2024-03-01',
    updated_at: '2024-03-01',
  },
  {
    id: '5',
    name: 'Arcanin',
    img_url: '/testimgs/Arcanin.png',
    rarity: 3,
    official_id: '014/226',
    created_at: '2024-03-01',
    updated_at: '2024-03-01',
  },
  {
    id: '6',
    name: 'Bulbizarre',
    img_url: '/testimgs/Bulbizarre.png',
    rarity: 1,
    official_id: '001/226',
    created_at: '2024-03-01',
    updated_at: '2024-03-01',
  },
  {
    id: '7',
    name: 'Herbizarre',
    img_url: '/testimgs/Herbizarre.png',
    rarity: 2,
    official_id: '002/226',
    created_at: '2024-03-01',
    updated_at: '2024-03-01',
  },
  {
    id: '8',
    name: 'Chimpanfeu',
    img_url: '/testimgs/Chimpanfeu.png',
    rarity: 2,
    official_id: '024/226',
    created_at: '2024-03-01',
    updated_at: '2024-03-01',
  },
  {
    id: '9',
    name: 'Drakarmin',
    img_url: '/testimgs/Drakarmin.png',
    rarity: 2,
    official_id: '114/226',
    created_at: '2024-03-01',
    updated_at: '2024-03-01',
  },
  {
    id: '10',
    name: 'Magnezone',
    img_url: '/testimgs/Magnezone.png',
    rarity: 3,
    official_id: '068/226',
    created_at: '2024-03-01',
    updated_at: '2024-03-01',
  },
];

export default function CardPage() {
  const [ownedCards, setOwnedCards] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    console.log('Cartes en double :', ownedCards);
    console.log('Cartes voulu :', wishlist);
  }, [ownedCards, wishlist]);

  const toggleCard = (
    cardId: string,
    list: string[],
    setList: (val: string[]) => void,
  ) => {
    if (list.includes(cardId)) {
      setList(list.filter((id) => id !== cardId));
    } else {
      setList([...list, cardId]);
    }
  };

  return (
    <div
      className='
      grid gap-2 p-4 justify-center lg:grid-cols-8 grid-cols-[repeat(auto-fit,_minmax(110px,_1fr))]'
    >
      {mockCards.map((card) => (
        <div key={card.id} className='justify-self-center'>
          <Image
            src={card.img_url}
            alt={card.name}
            width={150}
            height={200}
            className='shadow-base'
          />

          {/* <CardSelector
            cardId={card.id}
            ownedCards={ownedCards}
            wishlist={wishlist}
            toggleOwned={(id) => toggleCard(id, ownedCards, setOwnedCards)}
            toggleWishlist={(id) => toggleCard(id, wishlist, setWishlist)}
          /> */}
        </div>
      ))}
    </div>
  );
}
