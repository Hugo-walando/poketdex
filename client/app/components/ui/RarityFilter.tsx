'use client';

import { rarities, rarityIcons } from '@/app/data/rarities';
import { ChevronDown, ChevronUp, StarIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface RarityFilterProps {
  selectedRarities: number[];
  onToggleRarity: (rarity: number) => void;
}

export default function RarityFilter({
  selectedRarities,
  onToggleRarity,
}: RarityFilterProps) {
  const [open, setOpen] = useState(false);

  const hasSelected = selectedRarities.length > 0;

  const toggleDropdown = () => setOpen((prev) => !prev);

  return (
    <div className='relative text-left '>
      <button
        onClick={toggleDropdown}
        className='flex items-center gap-2 px-2 sm:px-3 md:px-4 py-2 text-gray-base sm:text-gray-lg md:text-gray-xl bg-white rounded-xl shadow-base hover:cursor-pointer'
      >
        <StarIcon className='w-4 h-4 md:w-5 md:h-5 text-darkgray fill-darkgray' />
        Rareté
        {open ? (
          <ChevronUp className='w-6 h-6' />
        ) : (
          <ChevronDown className='w-6 h-6' />
        )}
      </button>
      {hasSelected && (
        <span className='absolute top-0 right-0 w-2 h-2 rounded-full bg-primarygreen ring-2 ring-white' />
      )}

      {open && (
        <div className='absolute z-10 mt-1 mx-auto w-[300px] bg-white rounded-xl shadow-base p-2 grid grid-cols-2 gap-2'>
          {rarities.map((rarity) => (
            <button
              key={rarity}
              onClick={() => {
                onToggleRarity(rarity);
              }}
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
          ))}
        </div>
      )}
    </div>
  );
}
