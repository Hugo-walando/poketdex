'use client';

import SearchBar from '../ui/SearchBar';
import SetFilterDropdown from '../ui/SetFilterDropDown';
import RarityFilter from '../ui/RarityFilter';
import type { ListedCard } from '@/app/types/index';
import ResetFilters from '../ui/ResetFilters';
import { useEffect, useState } from 'react';
import { mockListedCards } from '@/app/data/mockListedCards';
import ListedCardItem from './ListedCardItem';
import { FilterDropdownProvider } from '@/app/context/FilterContext';
import Loader from '../ui/Loader';
import useFetchSets from '@/app/hooks/useFetchSets';

interface LeftColumnProps {
  onCardClick: (card: ListedCard) => void;
}

export default function LeftColumn({ onCardClick }: LeftColumnProps) {
  const { sets: Sets, loading: setsLoading, error: setsError } = useFetchSets();

  const [listedCards, setListedCards] = useState<ListedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSets, setSelectedSets] = useState<string[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<number[]>([]);

  useEffect(() => {
    // Plus tard un fetch ici
    // fetch('/api/listed-cards').then(...)

    setListedCards(mockListedCards); // pour l’instant on simule
  }, []);

  // Reset Filters
  const hasActiveFilters =
    searchQuery.length > 0 ||
    selectedSets.length > 0 ||
    selectedRarities.length > 0;

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedSets([]);
    setSelectedRarities([]);
  };

  const toggleSet = (setId: string) => {
    setSelectedSets((prev) =>
      prev.includes(setId)
        ? prev.filter((id) => id !== setId)
        : [...prev, setId],
    );
  };

  const filteredListedCards = listedCards.filter((item) => {
    const card = item.card;

    const matchSearch =
      searchQuery === '' ||
      card.name.toLowerCase().includes(searchQuery) ||
      card.official_id.toString().includes(searchQuery);

    const matchSet =
      selectedSets.length === 0 || selectedSets.includes(card.set_code);

    const matchRarity =
      selectedRarities.length === 0 || selectedRarities.includes(card.rarity);

    return matchSearch && matchSet && matchRarity;
  });

  if (setsLoading) return <Loader />;

  if (setsError)
    return <div className='text-center mt-10 text-red-500'>{setsError}</div>;

  return (
    <div className='w-full md:w-6/10 mb-10 mt-14 md:mt-0 gap-6'>
      <h1 className='text-dark-base md:text-dark-xl mb-2'>Cartes Listées</h1>

      <SearchBar
        placeholder='Rechercher une carte...'
        onSearch={(query) => setSearchQuery(query.toLowerCase())}
      />
      <div className='w-full my-6 flex gap-2 md:gap-4'>
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
            onToggleRarity={(rarity) =>
              setSelectedRarities((prev) =>
                prev.includes(rarity)
                  ? prev.filter((r) => r !== rarity)
                  : [...prev, rarity],
              )
            }
          />
        </FilterDropdownProvider>
        <ResetFilters onClick={resetAllFilters} disabled={!hasActiveFilters} />
      </div>

      <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4'>
        {filteredListedCards.length === 0 ? (
          <p className='text-gray-xl col-span-full text-center mt-10'>
            Aucune carte trouvée avec ces filtres.
          </p>
        ) : (
          filteredListedCards.map((item) => (
            <ListedCardItem
              key={item._id}
              data={item}
              onClick={() => {
                onCardClick(item);
                setSelectedCardId(item.card._id);
              }}
              isSelected={selectedCardId === item.card._id}
            />
          ))
        )}
      </div>
    </div>
  );
}
