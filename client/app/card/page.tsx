'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import CardSelector from '@/app/components/ui/CardSelector';
import SearchBar from '../components/ui/SearchBar';
import SetFilterDropdown from '../components/ui/SetFilterDropDown';
import RarityFilter from '../components/ui/RarityFilter';
import ResetFilters from '../components/ui/ResetFilters';
import { matchCard } from '../utils/matchCards';
import { Card, Set } from '../types';
import FiltersWrapper from '../components/layout/FiltersWrapper';
import { FilterDropdownProvider } from '../context/FilterContext';
import ProtectedPage from '../components/auth/ProtectedPage';
// import useFetchCardsBySets from '@/app/hooks/useFetchCardsBySet';
// import Loader from '../components/ui/Loader';
// import { useSets } from '../context/SetsContext';
// import useFetchSets from '../hooks/useFetchSets';
import { useGlobalData } from '../store/useGlobalData';

export default function CardPage() {
  console.log('📄 CardPage rendered');

  const Sets = useGlobalData((state) => state.sets);
  const cardsBySet = useGlobalData((state) => state.cardsBySet);

  const [ownedCards, setOwnedCards] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSets, setSelectedSets] = useState<string[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<number[]>([]);

  console.log('🎯 CardPage mounted with Sets:', Sets);

  useEffect(() => {
    console.log('[🧪 TEST] Sets:', Sets);
    console.log('[🧪 TEST] CardsBySet:', cardsBySet);
  }, [Sets, cardsBySet]);

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.length > 0 ||
      selectedSets.length > 0 ||
      selectedRarities.length > 0
    );
  }, [searchQuery, selectedSets, selectedRarities]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedSets([]);
    setSelectedRarities([]);
  };

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

  const toggleSet = (setId: string) => {
    setSelectedSets((prev) =>
      prev.includes(setId)
        ? prev.filter((id) => id !== setId)
        : [...prev, setId],
    );
  };

  const toggleRarity = (rarity: number) => {
    setSelectedRarities((prev) =>
      prev.includes(rarity)
        ? prev.filter((r) => r !== rarity)
        : [...prev, rarity],
    );
  };
  // if (setsLoading || cardsLoading) return <Loader />;

  // if (setsError || cardsError)
  //   return (
  //     <div className='text-center mt-10 text-red-500'>
  //       {setsError || cardsError}
  //     </div>
  //   );

  return (
    <ProtectedPage>
      <FiltersWrapper className='my-10 md:flex gap-6'>
        <div className='w-full md:w-[600px] mx-auto md:mx-0 '>
          <SearchBar
            placeholder='Rechercher une carte...'
            onSearch={(query) => setSearchQuery(query.toLowerCase())}
          />
        </div>
        <div className='w-full md:w-auto gap-4 mt-4 md:mt-0 sm:justify-start flex '>
          <FilterDropdownProvider>
            {Sets.length > 0 && (
              <SetFilterDropdown
                selectedSets={selectedSets}
                onToggleSet={toggleSet}
                sets={Sets}
              />
            )}
            <RarityFilter
              selectedRarities={selectedRarities}
              onToggleRarity={toggleRarity}
            />
          </FilterDropdownProvider>
          <ResetFilters
            onClick={resetAllFilters}
            disabled={!hasActiveFilters}
          />
        </div>
      </FiltersWrapper>
      {Sets.map((set: Set) => {
        return (
          <div key={set.code}>
            <div className='flex items-center justify-center md:justify-normal w-full md:bg-white md:rounded-xl md:p-3 md:shadow-base gap-3 mb-6 md:w-max'>
              <Image
                src={set.img_url}
                alt={set.name}
                width={0}
                height={0}
                sizes='100vw'
                className='w-auto h-[50px]'
              />
            </div>
          </div>
        );
      })}
      <div className='w-full max-w-[1400px] mx-auto p-2 md:p-0'>
        {Sets.map((set: Set) => {
          const cards = cardsBySet[set.code]?.filter(
            (card: Card) =>
              matchCard(card, set, searchQuery) &&
              (selectedSets.length === 0 ||
                selectedSets.includes(card.set_code)) &&
              (selectedRarities.length === 0 ||
                selectedRarities.includes(card.rarity)),
          );

          if (!cards || cards.length === 0) return null;

          return (
            <section key={set.code} className='mb-12'>
              <div className='flex items-center justify-center md:justify-normal w-full md:bg-white md:rounded-xl md:p-3 md:shadow-base gap-3 mb-6 md:w-max'>
                <Image
                  src={set.img_url}
                  alt={set.name}
                  width={0}
                  height={0}
                  sizes='100vw'
                  className='w-auto h-[50px]'
                />
              </div>
              <div className='grid gap-6 justify-center grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))] sm:grid-cols-[repeat(auto-fit,_minmax(130px,_1fr))] md:grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] xl:grid-cols-8'>
                {cards.map((card: Card) => (
                  <div key={card.official_id} className='justify-self-center'>
                    {card.img_url ? (
                      <Image
                        src={card.img_url}
                        alt={card.name || 'Carte'}
                        width={0}
                        height={0}
                        sizes='100vw'
                        className='w-[120px] sm:w-[130px] md:w-[150px] lg:w-[170px] xl:w-[190px] 2xl:w-[210px] h-auto shadow-base mx-auto'
                      />
                    ) : (
                      <div className='w-[120px] h-[180px] bg-gray-200 rounded shadow-base mx-auto flex items-center justify-center text-sm text-gray-500'>
                        Image manquante
                      </div>
                    )}

                    <CardSelector
                      cardId={card.official_id.toString()}
                      ownedCards={ownedCards}
                      wishlist={wishlist}
                      toggleOwned={(id) =>
                        toggleCard(id, ownedCards, setOwnedCards)
                      }
                      toggleWishlist={(id) =>
                        toggleCard(id, wishlist, setWishlist)
                      }
                    />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </ProtectedPage>
  );
}
