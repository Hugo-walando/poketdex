'use client';

import SearchBar from '../ui/SearchBar';
import SetFilterDropdown from '../ui/SetFilterDropDown';
import RarityFilter from '../ui/RarityFilter';
import type { ListedCard, WishlistCard } from '@/app/types/index';
import ResetFilters from '../ui/ResetFilters';
import { useState } from 'react';
import ListedCardItem from './ListedCardItem';
import { FilterDropdownProvider } from '@/app/context/FilterContext';
import { useGlobalData } from '@/app/store/useGlobalData';
import { useAllListedCardsStore } from '@/app/store/useAllListedCardsStore';
import { useUserStore } from '@/app/store/useUserStore';
import { RefreshCcw } from 'lucide-react';

interface LeftColumnProps {
  onCardClick: (card: ListedCard) => void;
}

export default function LeftColumn({ onCardClick }: LeftColumnProps) {
  const sets = useGlobalData((s) => s.sets);
  const user = useUserStore((s) => s.user);
  const { refetchListedCards } = useAllListedCardsStore();

  const { allListedCards, loading: ListedCardsLoading } =
    useAllListedCardsStore();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSets, setSelectedSets] = useState<string[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<number[]>([]);

  const hasWishlistOfSameRarity = (
    wishlistCards: WishlistCard[] = [],
    rarity: number,
  ) => {
    return wishlistCards.some((wish) => wish.card.rarity === rarity);
  };

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

    // 1. Exclure nos propres cartes
    if (item.user._id === user?.id) {
      return false;
    }

    // 2. Filtrer par search, set, rarity
    const matchSearch =
      searchQuery === '' ||
      card.name.toLowerCase().includes(searchQuery) ||
      card.official_id.toString().includes(searchQuery);

    const matchSet =
      selectedSets.length === 0 || selectedSets.includes(card.set_code);

    const matchRarity =
      selectedRarities.length === 0 || selectedRarities.includes(card.rarity);

    // 3. Filtrer sur la wishlist de même rareté
    const wishlistAvailable = item.user.wishlist_cards || [];
    const hasSameRarityWishlist = hasWishlistOfSameRarity(
      wishlistAvailable,
      card.rarity,
    );

    return matchSearch && matchSet && matchRarity && hasSameRarityWishlist;
  });
  return (
    <div className='w-full md:w-6/10 mb-10 mt-14 md:mt-0 gap-6 relative'>
      <div className='sticky top-0 z-10 rounded-xl mb-4 bg-gradient-to-t p-4 from-whitebackground/0 via-whitebackground/95 to-whitebackground/100'>
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
                onToggleRarity={(rarity) =>
                  setSelectedRarities((prev) =>
                    prev.includes(rarity)
                      ? prev.filter((r) => r !== rarity)
                      : [...prev, rarity],
                  )
                }
              />
            </FilterDropdownProvider>
            <ResetFilters
              onClick={resetAllFilters}
              disabled={!hasActiveFilters}
            />
          </div>
          <button
            onClick={() => refetchListedCards?.()}
            className='px-3 py-2 bg-primarygreen text-white rounded hover:opacity-90 flex items-center gap-2 hover:cursor-pointer'
          >
            Refresh les cartes <RefreshCcw className='w-4 h-4 inline' />
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
        ) : filteredListedCards.length === 0 ? (
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
