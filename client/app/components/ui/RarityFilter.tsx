'use client';

import { ChevronDown, ChevronUp, StarIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface RarityFilterProps {
  selectedRarities: number[];
  onToggleRarity: (rarity: number) => void;
}

const rarities = [1, 2, 3, 4, 5, 6, 7, 8]; // 8 niveaux de rareté

const rarityIcons: Record<number, string> = {
  1: '/testimgs/rarities/1.png',
  2: '/testimgs/rarities/2.png',
  3: '/testimgs/rarities/3.png',
  4: '/testimgs/rarities/4.png',
  5: '/testimgs/rarities/5.png',
  6: '/testimgs/rarities/6.png',
  7: '/testimgs/rarities/7.png',
  8: '/testimgs/rarities/8.png',
};

export default function RarityFilter({
  selectedRarities,
  onToggleRarity,
}: RarityFilterProps) {
  const [open, setOpen] = useState(false);

  const hasSelected = selectedRarities.length > 0;

  const toggleDropdown = () => setOpen((prev) => !prev);

  return (
    <div className='relative inline-block text-left '>
      <button
        onClick={toggleDropdown}
        className='flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-base text-gray-xl hover:cursor-pointer'
      >
        <StarIcon className='w-5 h-5 text-darkgray fill-darkgray' />
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
