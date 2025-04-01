'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Set } from '@/app/types';
import BoosterIcon from '../svgs/BoosterIcon';
import { useFilter } from '@/app/context/FilterContext';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const mockSets: Set[] = [
  {
    id: '1',
    name: 'Puissance Génétique',
    color: '#FFD700',
    img_url: '/testimgs/sets/PuissanceGénétique.png',
    card_count: 226,
  },
  {
    id: '2',
    name: 'Ile Fabuleuse',
    color: '#FF006E',
    img_url: '/testimgs/sets/IleFabuleuse.png',
    card_count: 86,
  },
  {
    id: '3',
    name: 'Choc Spacio Temporel',
    color: '#00C2FF',
    img_url: '/testimgs/sets/ChocSpacioTemporel.png',
    card_count: 178,
  },
];

interface SetFilterDropdownProps {
  selectedSets: string[];
  onToggleSet: (setId: string) => void;
}

export default function SetFilterDropdown({
  selectedSets,
  onToggleSet,
}: SetFilterDropdownProps) {
  const [sets, setSets] = useState<Set[]>(mockSets);
  const hasSelected = selectedSets.length > 0;

  const { openFilter, setOpenFilter } = useFilter();

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const res = await fetch('/api/sets');
        if (!res.ok)
          throw new Error('Erreur lors du chargement des extensions');
        const data = await res.json();
        setSets(data);
      } catch (err) {
        console.warn(err, 'Utilisation du mockSet (API non disponible)');
      }
    };

    fetchSets();
  }, []);

  return (
    <DropdownMenu.Root
      open={openFilter === 'set'}
      onOpenChange={(isOpen) => setOpenFilter(isOpen ? 'set' : null)}
    >
      <DropdownMenu.Trigger asChild>
        <button className='flex items-center gap-2 px-2 sm:px-3 md:px-4 py-2 bg-white rounded-xl shadow-base text-gray-base sm:text-gray-lg md:text-gray-xl hover:cursor-pointer'>
          <BoosterIcon className='w-4 h-4 md:w-5 md:h-5 text-darkgray' />
          Extension
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='w-6 h-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 9l-7 7-7-7'
            />
          </svg>
        </button>
      </DropdownMenu.Trigger>

      {hasSelected && (
        <span className='absolute top-0 right-0 w-2 h-2 rounded-full bg-primarygreen ring-2 ring-white' />
      )}

      <DropdownMenu.Content
        sideOffset={8}
        align='start'
        className='z-10 w-[300px] bg-white rounded-xl shadow-base p-2 grid grid-cols-2 gap-2'
      >
        {sets.map((set) => {
          const isSelected = selectedSets.includes(set.id);
          return (
            <DropdownMenu.Item asChild key={set.id}>
              <button
                onClick={() => onToggleSet(set.id)}
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
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
