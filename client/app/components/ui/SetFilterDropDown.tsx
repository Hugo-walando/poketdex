'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

interface Set {
  id: string;
  name: string;
  color: string;
  img_url: string;
}

const mockSets: Set[] = [
  {
    id: '1',
    name: 'Puissance Génétique',
    color: '#FFD700',
    img_url: '/testimgs/PuissanceGénétique.png',
  },
  {
    id: '2',
    name: 'Ile Fabuleuse',
    color: '#FF006E',
    img_url: '/testimgs/IleFabuleuse.png',
  },
  {
    id: '3',
    name: 'Choc Spacio Temporel',
    color: '#00C2FF',
    img_url: '/testimgs/ChocSpacioTemporel.png',
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
        console.warn('Utilisation du mockSet (API non disponible)');
      }
    };

    fetchSets();
  }, []);

  return (
    <div className='relative inline-block text-left '>
      <button
        onClick={toggleDropdown}
        className='flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-base text-gray-xl hover:cursor-pointer'
      >
        Extension
        <ChevronDown className='w-6 h-6' />
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
                  width={100}
                  height={100}
                  quality={100}
                  className='object-contain h-auto  '
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
