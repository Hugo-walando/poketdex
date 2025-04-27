'use client';

import { useMatchStore } from '@/app/store/useMatchStore';
import MatchGroupItem from './MatchGroupItem';
import { useGlobalData } from '@/app/store/useGlobalData';

interface MatchListProps {
  loading: boolean;
}

export default function MatchList({ loading }: MatchListProps) {
  const matchGroups = useMatchStore((state) => state.matchGroups);
  const { sets } = useGlobalData();

  if (loading) {
    return (
      <div className='flex justify-center items-center h-[300px]'>
        <p className='text-gray-xl'>Chargement des matchs...</p>
      </div>
    );
  }

  if (!matchGroups.length) {
    return (
      <p className='text-gray-xl text-center mt-20 md:mt-10'>
        Aucun match disponible.
      </p>
    );
  }

  return (
    <div className='mt-14 md:mt-0 px-2 md:p-2 pb-30'>
      <h2 className='text-dark-base sm:text-dark-xl mb-2 text-right'>Matchs</h2>

      <div className='flex flex-col gap-2'>
        {matchGroups.map((group) => (
          <MatchGroupItem key={group.user._id} group={group} sets={sets} />
        ))}
        <div className='bg-white rounded-xl shadow-base'>
          <div className='flex items-center gap-3 px-4 py-2'>
            <div className='w-8 h-8 rounded-full bg-gray-300' />{' '}
            {/* cercle gris à la place de l'image */}
            <span className='text-dark-sm sm:text-dark-base text-nowrap font-semibold'>
              Test (2 matchs)
            </span>
          </div>
        </div>
        <div className='bg-white rounded-xl shadow-base'>
          <div className='flex items-center gap-3 px-4 py-2'>
            <div className='w-8 h-8 rounded-full bg-gray-300' />{' '}
            {/* cercle gris à la place de l'image */}
            <span className='text-dark-sm sm:text-dark-base text-nowrap font-semibold'>
              Test (2 matchs)
            </span>
          </div>
        </div>
        <div className='bg-white rounded-xl shadow-base'>
          <div className='flex items-center gap-3 px-4 py-2'>
            <div className='w-8 h-8 rounded-full bg-gray-300' />{' '}
            {/* cercle gris à la place de l'image */}
            <span className='text-dark-sm sm:text-dark-base text-nowrap font-semibold'>
              Test (2 matchs)
            </span>
          </div>
        </div>
        <div className='bg-white rounded-xl shadow-base'>
          <div className='flex items-center gap-3 px-4 py-2'>
            <div className='w-8 h-8 rounded-full bg-gray-300' />{' '}
            {/* cercle gris à la place de l'image */}
            <span className='text-dark-sm sm:text-dark-base text-nowrap font-semibold'>
              Test (2 matchs)
            </span>
          </div>
        </div>
        <div className='bg-white rounded-xl shadow-base'>
          <div className='flex items-center gap-3 px-4 py-2'>
            <div className='w-8 h-8 rounded-full bg-gray-300' />{' '}
            {/* cercle gris à la place de l'image */}
            <span className='text-dark-sm sm:text-dark-base text-nowrap font-semibold'>
              Test (2 matchs)
            </span>
          </div>
        </div>
        <div className='bg-white rounded-xl shadow-base'>
          <div className='flex items-center gap-3 px-4 py-2'>
            <div className='w-8 h-8 rounded-full bg-gray-300' />{' '}
            {/* cercle gris à la place de l'image */}
            <span className='text-dark-sm sm:text-dark-base text-nowrap font-semibold'>
              Test (2 matchs)
            </span>
          </div>
        </div>
        <div className='bg-white rounded-xl shadow-base'>
          <div className='flex items-center gap-3 px-4 py-2'>
            <div className='w-8 h-8 rounded-full bg-gray-300' />{' '}
            {/* cercle gris à la place de l'image */}
            <span className='text-dark-sm sm:text-dark-base text-nowrap font-semibold'>
              Test (2 matchs)
            </span>
          </div>
        </div>
        <div className='bg-white rounded-xl shadow-base'>
          <div className='flex items-center gap-3 px-4 py-2'>
            <div className='w-8 h-8 rounded-full bg-gray-300' />{' '}
            {/* cercle gris à la place de l'image */}
            <span className='text-dark-sm sm:text-dark-base text-nowrap font-semibold'>
              Test (2 matchs)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
