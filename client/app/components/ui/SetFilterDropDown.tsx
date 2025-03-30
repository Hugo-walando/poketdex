'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Set } from '@/app/types';
import BoosterIcon from '../svgs/BoosterIcon';

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
  const [open, setOpen] = useState(false);
  const [sets, setSets] = useState<Set[]>(mockSets); // initialisé avec mock

  const hasSelected = selectedSets.length > 0;

  const toggleDropdown = () => setOpen((prev) => !prev);

  useEffect(() => {
    // Pour l'API plus tard

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
    <div className='relative text-left '>
      <button
        onClick={toggleDropdown}
        className='flex items-center gap-2 px-3 md:px-4 py-2 bg-white rounded-xl shadow-base text-gray-lg md:text-gray-xl hover:cursor-pointer'
      >
        <BoosterIcon className='w-4 h-4 md:w-5 md:h-5 text-darkgray' />
        Extension
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
          {sets.map((set) => {
            const isSelected = selectedSets.includes(set.id);
            return (
              <button
                key={set.id}
                onClick={() => {
                  onToggleSet(set.id);
                }}
                className={`w-full p-1 rounded-xl shadow-base flex items-center justify-center transition hover:cursor-pointer
                ${isSelected ? 'bg-darkgray inset-shadow-field' : 'bg-white'}`}
              >
                <Image
                  src={set.img_url}
                  alt={set.name}
                  width={0}
                  height={0}
                  sizes='100vw'
                  quality={100}
                  className='object-contain h-[50px] w-auto  '
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
