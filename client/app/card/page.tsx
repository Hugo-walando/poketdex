'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import CardSelector from '@/app/components/ui/CardSelector';
import SearchBar from '../components/ui/SearchBar';

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
  const userId = '123'; // Temporaire, à remplacer par l'ID utilisateur réel

  const [ownedCards, setOwnedCards] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredCards = mockCards.filter(
    (card) =>
      card.name.toLowerCase().includes(searchQuery) ||
      card.official_id.toLowerCase().includes(searchQuery),
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Simulation avec un délai (à remplacer par fetch réel)
        await new Promise((res) => setTimeout(res, 800));

        const mockWishlist = ['1'];
        const mockDuplicates = ['2'];

        setWishlist(mockWishlist);
        setOwnedCards(mockDuplicates);
      } catch (err) {
        console.error('Erreur lors du chargement des données utilisateur', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading)
    return (
      <div className='p-4 text-center text-gray-xl'>
        Chargement des cartes ...
      </div>
    );

  return (
    <>
      <div className='w-[600px] my-10'>
        <SearchBar
          placeholder='Rechercher une carte...'
          onSearch={(query) => setSearchQuery(query.toLowerCase())}
        />
      </div>
      <div className='w-full max-w-[1400px] mx-auto p-2 md:p-0'>
        <div className='grid gap-6 justify-center grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))] sm:grid-cols-[repeat(auto-fit,_minmax(130px,_1fr))] md:grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] xl:grid-cols-8'>
          {filteredCards.map((card) => (
            <div key={card.id} className='justify-self-center'>
              <Image
                src={card.img_url}
                alt={card.name}
                width={0}
                height={0}
                sizes='100vw'
                className=' w-[120px]
                          sm:w-[130px]
                          md:w-[150px]
                          lg:w-[170px]
                          xl:w-[190px]
                          2xl:w-[210px]
                          h-auto
                          shadow-base
                          mx-auto
                          '
              />

              <CardSelector
                cardId={card.id}
                ownedCards={ownedCards}
                wishlist={wishlist}
                toggleOwned={(id) => toggleCard(id, ownedCards, setOwnedCards)}
                toggleWishlist={(id) => toggleCard(id, wishlist, setWishlist)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
