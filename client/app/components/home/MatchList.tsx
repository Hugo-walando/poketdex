'use client';

import { MatchGroup } from '@/app/types';
import MatchGroupItem from './MatchGroupItem';
import { useEffect, useState } from 'react';
import { fetchMatchGroups } from '@/app/api/matches/matches';

export default function MatchList() {
  const [matchGroups, setMatchGroups] = useState<MatchGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatchGroups().then((data) => {
      setMatchGroups(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <p className='text-gray-xl text-center mt-20 md:mt-10'>
        Chargement des matchs...
      </p>
    );
  }

  if (matchGroups.length === 0) {
    return (
      <p className='text-gray-xl text-center mt-20 md:mt-10'>
        Aucun match disponible.
      </p>
    );
  }
  return (
    <div className='mt-14 md:mt-0 px-2 md:p-2 pb-30'>
      <h2 className='text-dark-base sm:text-dark-xl mb-2 text-right'>Matchs</h2>
      <div className='  flex flex-col gap-2'>
        {matchGroups.map((group) => (
          <MatchGroupItem key={group.user.id} group={group} />
        ))}
      </div>
    </div>
  );
}
