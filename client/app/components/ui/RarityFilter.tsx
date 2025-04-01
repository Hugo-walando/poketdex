'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useFilter } from '@/app/context/FilterContext';
import { rarities, rarityIcons } from '@/app/data/rarities';
import { ChevronDown, ChevronUp, StarIcon } from 'lucide-react';
import Image from 'next/image';

interface RarityFilterProps {
  selectedRarities: number[];
  onToggleRarity: (rarity: number) => void;
}

export default function RarityFilter({
  selectedRarities,
  onToggleRarity,
}: RarityFilterProps) {
  const { openFilter, setOpenFilter } = useFilter();
  const isOpen = openFilter === 'rarity';
  const hasSelected = selectedRarities.length > 0;

  return (
    <DropdownMenu.Root
      open={isOpen}
      onOpenChange={() => setOpenFilter(isOpen ? null : 'rarity')}
    >
      <DropdownMenu.Trigger asChild>
        <button className='relative flex items-center gap-2 px-2 sm:px-3 md:px-4 py-2 text-gray-base md:text-gray-xl bg-white rounded-xl shadow-base hover:cursor-pointer'>
          <StarIcon className='w-4 h-4 md:w-5 md:h-5 text-darkgray fill-darkgray' />
          Rareté
          {isOpen ? (
            <ChevronUp className='w-5 h-5' />
          ) : (
            <ChevronDown className='w-5 h-5' />
          )}
          {hasSelected && (
            <span className='absolute top-0 right-0 w-2 h-2 rounded-full bg-primarygreen ring-2 ring-white' />
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          className='z-50 mt-1 mx-auto w-[300px] bg-white rounded-xl shadow-base p-2 grid grid-cols-2 gap-2'
        >
          {rarities.map((rarity) => (
            <DropdownMenu.Item asChild key={rarity}>
              <button
                onClick={() => onToggleRarity(rarity)}
                className={`w-full p-1 rounded-xl shadow-base flex items-center justify-center transition hover:cursor-pointer
                ${
                  selectedRarities.includes(rarity)
                    ? 'bg-darkgray inset-shadow-field'
                    : 'bg-white'
                }`}
              >
                <Image
                  src={rarityIcons[rarity]}
                  alt={`Rareté ${rarity}`}
                  width={0}
                  height={0}
                  sizes='100vw'
                  quality={100}
                  className='object-contain w-auto h-[25px]'
                />
              </button>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
