'use client';

import Image from 'next/image';
import { Set } from '@/app/types';
import BoosterIcon from '../svgs/BoosterIcon';
import { useFilter } from '@/app/context/FilterContext';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect } from 'react';

interface SetFilterDropdownProps {
  selectedSets: string[];
  onToggleSet: (setId: string) => void;
  sets: Set[]; // ✅ sets passés en props depuis la page
}

export default function SetFilterDropdown({
  selectedSets,
  onToggleSet,
  sets,
}: SetFilterDropdownProps) {
  console.log('SetFilterDropdown', selectedSets, sets);
  const hasSelected = selectedSets.length > 0;
  const { openFilter, setOpenFilter } = useFilter();

  const isOpen = openFilter === 'set';

  useEffect(() => {
    console.log('Re-rendering SetFilterDropdown');
  });

  return (
    <DropdownMenu.Root
      open={isOpen}
      onOpenChange={(isNowOpen) => {
        if (isNowOpen) {
          setOpenFilter('set');
        } else {
          setTimeout(() => {
            if (openFilter === 'set') setOpenFilter(null);
          }, 50);
        }
      }}
    >
      <DropdownMenu.Trigger asChild>
        <button className='relative flex items-center gap-2 px-2 h-max sm:px-3 md:px-4 py-2 bg-white rounded-xl shadow-base text-gray-base sm:text-gray-lg md:text-gray-xl hover:cursor-pointer'>
          <BoosterIcon className='w-4 h-4 md:w-5 md:h-5 text-darkgray' />
          Extension
          {isOpen ? (
            <ChevronUp className='w-5 h-5 text-darkgray' />
          ) : (
            <ChevronDown className='w-5 h-5 text-darkgray' />
          )}
          {hasSelected && (
            <span className='absolute top-0 right-0 w-2 h-2 rounded-full bg-primarygreen ring-2 ring-white' />
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        sideOffset={8}
        align='start'
        className='z-10 w-[300px] bg-white rounded-xl shadow-base p-2 grid grid-cols-2 gap-2'
      >
        {sets.map((set) => {
          const isSelected = selectedSets.includes(set.code); // ✅ on utilise `set.code` comme identifiant
          return (
            <div key={set.code}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSet(set.code); // ✅ passe `set.code`
                }}
                className={`w-full p-1 rounded-xl shadow-base flex items-center justify-center transition hover:cursor-pointer ${
                  isSelected ? 'bg-darkgray inset-shadow-field' : 'bg-white'
                }`}
              >
                <Image
                  src={set.img_url}
                  alt={set.name}
                  width={0}
                  height={0}
                  sizes='100vw'
                  quality={100}
                  className='object-contain h-[50px] w-auto'
                />
              </button>
            </div>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
