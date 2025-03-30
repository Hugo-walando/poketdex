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
      <p className='text-gray-xl text-center mt-10'>Chargement des matchs...</p>
    );
  }

  if (matchGroups.length === 0) {
    return (
      <p className='text-gray-xl text-center mt-10'>Aucun match disponible.</p>
    );
  }
  return (
    <div className='space-y-6'>
      {matchGroups.map((group) => (
        <MatchGroupItem key={group.user.id} group={group} />
      ))}
    </div>
  );
}
