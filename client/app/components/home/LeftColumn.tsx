'use client';

import SearchBar from '../ui/SearchBar';
import SetFilterDropdown from '../ui/SetFilterDropDown';
import RarityFilter from '../ui/RarityFilter';
import type { ListedCard } from '@/app/types/index';
import ResetFilters from '../ui/ResetFilters';
import { useState } from 'react';
import ListedCardItem from './ListedCardItem';
import { FilterDropdownProvider } from '@/app/context/FilterContext';
import { useGlobalData } from '@/app/store/useGlobalData';
import { useAllListedCardsStore } from '@/app/store/useAllListedCardsStore';
import { RefreshCcw } from 'lucide-react';

interface LeftColumnProps {
  onCardClick: (card: ListedCard) => void;
}

export default function LeftColumn({ onCardClick }: LeftColumnProps) {
  const sets = useGlobalData((s) => s.sets);

  const {
    allListedCards,
    loading: ListedCardsLoading,
    refetchListedCards,
    pagination: { page, totalPages, setPage },
    searchQuery,
    setSearchQuery,
    selectedSets,
    setSelectedSets,
    selectedRarities,
    setSelectedRarities,
  } = useAllListedCardsStore();

  console.log('allListedCards', allListedCards);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

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
    const updated = selectedSets.includes(setId)
      ? selectedSets.filter((id) => id !== setId)
      : [...selectedSets, setId];

    setSelectedSets(updated);
  };

  console.log('filteredListedCards', allListedCards);
  return (
    <div className='w-full md:w-6/10 mb-10  gap-6 relative'>
      <div className='sticky top-0 z-10 mb-4 pt-10 md:pt-0 bg-gradient-to-t p-4 from-whitebackground/0 via-whitebackground/95 to-whitebackground/100'>
        <h1 className='text-dark-base md:text-dark-xl mb-2'>Cartes Listées</h1>

        <SearchBar
          placeholder='Rechercher une carte...'
          onSearch={(query) => setSearchQuery(query.toLowerCase())}
        />
        <div className='w-full mt-4 items-center flex justify-between'>
          <div className='flex gap-2 md:gap-4'>
            <FilterDropdownProvider>
              {sets.length > 0 && (
                <SetFilterDropdown
                  selectedSets={selectedSets}
                  onToggleSet={toggleSet}
                  sets={sets}
                />
              )}
              <RarityFilter
                selectedRarities={selectedRarities}
                onToggleRarity={(rarity) => {
                  const updated = selectedRarities.includes(rarity)
                    ? selectedRarities.filter((r) => r !== rarity)
                    : [...selectedRarities, rarity];

                  setSelectedRarities(updated);
                }}
              />
            </FilterDropdownProvider>
            <ResetFilters
              onClick={resetAllFilters}
              disabled={!hasActiveFilters}
            />
          </div>
          <button
            onClick={() => refetchListedCards?.()}
            className='px-3 py-2 bg-primarygreen text-white rounded-lg hover:opacity-90 flex items-center gap-2 hover:cursor-pointer'
          >
            <span className='text-sm font-poppins text-white'>
              <RefreshCcw className='w-4 h-4 inline shrink-0' />
            </span>
          </button>
        </div>
      </div>
      <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4'>
        {ListedCardsLoading ? (
          <div className='col-span-full flex justify-center items-center h-[200px]'>
            <p className='text-gray-xl animate-pulse'>
              Chargement des cartes...
            </p>
          </div>
        ) : allListedCards.length === 0 ? (
          <p className='text-gray-xl col-span-full text-center mt-10'>
            Aucune carte trouvée avec ces filtres.
          </p>
        ) : (
          allListedCards.map((item) => (
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
      {allListedCards.length > 0 && (
        <div className='flex justify-center gap-2 mt-6'>
          <button
            onClick={() => setPage(Math.max(page - 1, 1))}
            disabled={page === 1}
            className='px-3 py-2 bg-gray-200 rounded text-sm hover:cursor-pointer'
          >
            ← Précédent
          </button>
          <span className='px-3 py-2 text-sm font-medium'>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(page + 1, totalPages))}
            disabled={page === totalPages}
            className='px-3 py-2 bg-gray-200 rounded text-sm hover:cursor-pointer'
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
}
