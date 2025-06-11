'use client';

import { useMatchStore } from '@/app/store/useMatchStore';
import MatchGroupItem from './MatchGroupItem';
import { useGlobalData } from '@/app/store/useGlobalData';
import { useRouter } from 'next/navigation';
import useBatchTradeCreation from '@/app/hooks/useBatchTradeCreation';
import { useState } from 'react';

interface MatchListProps {
  loading: boolean;
}

export default function MatchList({ loading }: MatchListProps) {
  const matchGroups = useMatchStore((state) => state.matchGroups);
  const { sets } = useGlobalData();
  const [selectedMatchIds, setSelectedMatchIds] = useState<string[]>([]);
  const { createTradesFromMatches, loading: sending } = useBatchTradeCreation();
  const router = useRouter();

  const getTargetUserId = () => {
    for (const group of matchGroups) {
      if (group.trades.some((t) => selectedMatchIds.includes(t._id))) {
        return group.user._id;
      }
    }
    return null;
  };

  const toggleMatchSelection = (id: string) => {
    setSelectedMatchIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const handleSendRequests = async () => {
    if (selectedMatchIds.length === 0) return;
    const created = await createTradesFromMatches(selectedMatchIds);
    if (created) {
      const userId = getTargetUserId();
      setSelectedMatchIds([]);
      router.push(userId ? `/trades?user=${userId}` : '/trades');
    }
  };

  const totalMatchCount = matchGroups.reduce(
    (acc, group) => acc + group.trades.length,
    0,
  );

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
    <div className='flex flex-col h-full '>
      <div className='flex-1 overflow-y-auto pb-50  md:pb-0 px-2 md:p-2'>
        <h2 className='text-dark text-base md:text-xl font-semibold mt-10 md:mt-0 md:text-center pb-2 md:py-2 text-end sticky'>
          Match{totalMatchCount > 1 ? 's' : ''}{' '}
          <span className='md:text-lg text-sm text-gray'>
            ({totalMatchCount})
          </span>
        </h2>

        <div className='flex flex-col gap-2  pb-6'>
          {matchGroups.map((group) => (
            <MatchGroupItem
              key={group.user._id}
              group={group}
              sets={sets}
              selectedMatchIds={selectedMatchIds}
              onToggleMatchSelection={toggleMatchSelection}
            />
          ))}
        </div>
      </div>

      {/* Footer button */}
      <div className='px-6 md:py-3 z-50 md:bg-white rounded-xl md:shadow-base fixed bottom-40 w-full md:static '>
        <button
          onClick={handleSendRequests}
          disabled={selectedMatchIds.length === 0 || sending}
          className={`w-full py-3 rounded-xl font-semibold transition shadow-base
        ${
          selectedMatchIds.length === 0 || sending
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-primarygreen text-white hover:opacity-90 cursor-pointer'
        }`}
        >
          {sending
            ? 'Envoi en cours...'
            : selectedMatchIds.length > 0
              ? `Envoyer ${selectedMatchIds.length} demande(s)`
              : 'Sélectionnez des matchs pour envoyer'}
        </button>
      </div>
    </div>
  );
}
