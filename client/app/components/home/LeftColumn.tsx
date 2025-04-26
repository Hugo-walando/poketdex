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
import { useUserStore } from '@/app/store/useUserStore';

interface LeftColumnProps {
  onCardClick: (card: ListedCard) => void;
}

export default function LeftColumn({ onCardClick }: LeftColumnProps) {
  const sets = useGlobalData((s) => s.sets);
  const user = useUserStore((s) => s.user);

  const { allListedCards } = useAllListedCardsStore();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSets, setSelectedSets] = useState<string[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<number[]>([]);

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

  const filteredListedCards = allListedCards.filter((item) => {
    const card = item.card;
    console.log('Item:', item);
    console.log('Item User ID:', item.user._id);
    console.log('Current User ID:', user?.id);

    if (item.user._id === user?.id) {
      console.log("🚫 Exclure la carte de l'utilisateur");
      return false; // 👈 on exclut nos propres cartes
    }

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

  return (
    <div className='w-full md:w-6/10 mb-10 mt-14 md:mt-0 gap-6'>
      <h1 className='text-dark-base md:text-dark-xl mb-2'>Cartes Listées</h1>

      <SearchBar
        placeholder='Rechercher une carte...'
        onSearch={(query) => setSearchQuery(query.toLowerCase())}
      />
      <div className='w-full my-6 flex gap-2 md:gap-4'>
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
