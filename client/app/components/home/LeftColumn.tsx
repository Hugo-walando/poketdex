'use client';

import SearchBar from '../ui/SearchBar';
import SetFilterDropdown from '../ui/SetFilterDropDown';
import RarityFilter from '../ui/RarityFilter';
import type { ListedCard } from '@/app/types/index';
import ResetFilters from '../ui/ResetFilters';
import { useEffect, useState } from 'react';
import { mockListedCards } from '@/app/data/mockListedCards';

interface LeftColumnProps {
  onCardClick: (card: ListedCard) => void;
}

export default function LeftColumn({ onCardClick }: LeftColumnProps) {
  const [listedCards, setListedCards] = useState<ListedCard[]>([]);

  useEffect(() => {
    // Plus tard un fetch ici
    // fetch('/api/listed-cards').then(...)

    setListedCards(mockListedCards); // pour l’instant on simule
  }, []);

  return (
    <div className='w-full md:w-6/10 my-10 gap-6'>
      <SearchBar placeholder='Rechercher une carte...' onSearch={() => {}} />
      <div className='w-full my-6 flex gap-4'>
        <SetFilterDropdown selectedSets={[]} onToggleSet={() => {}} />
        <RarityFilter selectedRarities={[]} onToggleRarity={() => {}} />
        <ResetFilters onClick={() => {}} />
      </div>

      <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4'>
        <div
          className='w-full h-[180px] bg-gray-100 rounded-lg shadow-base hover:cursor-pointer'
          onClick={() => onCardClick(mockListedCards[0])}
        />
        {listedCards.map((item) => (
          <ListedCardItem
            key={item.duplicate_id}
            data={item}
            onClick={() => onCardClick(item)}
          />
        ))}
      </div>
    </div>
  );
}
