'use client';

import SearchBar from '../ui/SearchBar';
import SetFilterDropdown from '../ui/SetFilterDropDown';
import RarityFilter from '../ui/RarityFilter';
import type { Card } from '@/app/types/index';
import FiltersWrapper from '../layout/FiltersWrapper';

interface LeftColumnProps {
  onCardClick: (card: Card) => void;
}

const mockCard: Card = {
  id: '123',
  name: 'Pikachu',
  img_url: '/testimgs/cards/PikachuEx.png',
  rarity: 4,
  set_id: '1',
  official_id: 113,
  created_at: '2024-03-01',
  updated_at: '2024-03-01',
};

export default function LeftColumn({ onCardClick }: LeftColumnProps) {
  return (
    <div className='w-full md:w-2/3 flex flex-col gap-6'>
      <FiltersWrapper>
        <SearchBar placeholder='Rechercher une carte...' onSearch={() => {}} />
        <SetFilterDropdown selectedSets={[]} onToggleSet={() => {}} />
        <RarityFilter selectedRarities={[]} onToggleRarity={() => {}} />
      </FiltersWrapper>

      <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4'>
        <div
          className='w-full h-[180px] bg-gray-100 rounded-lg shadow-base hover:cursor-pointer'
          onClick={() => onCardClick(mockCard)}
        />
        <div className='w-full h-[180px] bg-gray-100 rounded-lg shadow-base' />
        <div className='w-full h-[180px] bg-gray-100 rounded-lg shadow-base' />
      </div>
    </div>
  );
}
