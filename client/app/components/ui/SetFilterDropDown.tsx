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
  selectedSet: string | null;
  onSelectSet: (setId: string | null) => void;
}

export default function SetFilterDropdown({
  selectedSet,
  onSelectSet,
}: SetFilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [sets, setSets] = useState<Set[]>(mockSets); // initialisé avec mock

  const toggleDropdown = () => setOpen((prev) => !prev);

  useEffect(() => {
    // Préparation pour la future intégration API
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
        {selectedSet
          ? mockSets.find((s) => s.id === selectedSet)?.name || 'Extension'
          : 'Extension'}
        <ChevronDown className='w-6 h-6' />
      </button>

      {open && (
        <div className='absolute z-10 mt-1 mx-auto w-[300px] bg-white rounded-xl shadow-base p-2 grid grid-cols-2 gap-2'>
          {sets.map((set) => (
            <button
              key={set.id}
              onClick={() => {
                onSelectSet(set.id);
                setOpen(false);
              }}
              className='w-full p-1 rounded hover:bg-gray-100 flex items-center justify-center'
            >
              <Image
                src={set.img_url}
                alt={set.name}
                width={100}
                height={100}
                quality={100}
                className='object-contain'
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
