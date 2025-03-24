'use client';

import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface RarityFilterProps {
  selectedRarities: number[];
  onToggleRarity: (rarity: number) => void;
}

const rarities = [1, 2, 3, 4, 5, 6, 7, 8]; // 8 niveaux de rareté

const rarityIcons: Record<number, string> = {
  1: '/icons/rarity1.png',
  2: '/icons/rarity2.png',
  3: '/icons/rarity3.png',
  4: '/icons/rarity4.png',
  5: '/icons/rarity5.png',
  6: '/icons/rarity6.png',
  7: '/icons/rarity7.png',
  8: '/icons/rarity8.png',
};

export default function RarityFilter({
  selectedRarities,
  onToggleRarity,
}: RarityFilterProps) {
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => setOpen((prev) => !prev);

  return (
    <div className='relative inline-block text-left '>
      <button
        onClick={toggleDropdown}
        className='flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-base text-gray-xl hover:cursor-pointer'
      >
        Rareté
        <ChevronDown className='w-6 h-6' />
      </button>

      {open && (
        <div className='absolute z-10 mt-1 mx-auto w-[300px] bg-white rounded-xl shadow-base p-2 grid grid-cols-2 gap-2'>
          {rarities.map((rarity) => (
            <button
              key={rarity}
              onClick={() => {
                onToggleRarity(rarity);
                setOpen(false);
              }}
              className='w-full p-1 rounded hover:bg-gray-100 flex items-center justify-center'
            >
              <Image
                src={rarityIcons[rarity]}
                alt={`Rareté ${rarity}`}
                width={100}
                height={100}
                quality={100}
                className='object-contain h-auto  '
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
