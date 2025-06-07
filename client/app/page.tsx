'use client';

import { useEffect, useState } from 'react';
import LeftColumn from './components/home/LeftColumn';
import RightColumn from './components/home/RightColumn';
import { ListedCard } from './types';
import useIsMobile from './hooks/useIsMobile';
import QuickTradeDetails from './components/home/QuickTradeDetails';
import MatchList from './components/home/MatchList';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProtectedPage from './components/auth/ProtectedPage';
import ProtectedLayout from './components/auth/ProtectedLayout';
import useFetchMatches from './hooks/useFetchMatches';
import AllListedCardsLoader from './components/data/AllListedCardsLoader';

export default function Home() {
  const [selectedCard, setSelectedCard] = useState<ListedCard | null>(null);
  const [viewMode, setViewMode] = useState<'default' | 'matchs'>('default');
  const isMobile = useIsMobile();
  const { loading } = useFetchMatches();

  useEffect(() => {
    if (isMobile && (selectedCard || viewMode === 'matchs')) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMobile, selectedCard, viewMode]);

  return (
    <ProtectedPage>
      <ProtectedLayout>
        <AllListedCardsLoader />

        {isMobile && viewMode === 'default' && (
          <button
            onClick={() => setViewMode('matchs')}
            className='fixed top-5 right-0 z-50 bg-white text-gray-base sm:text-gray-lg px-4 py-2 rounded-l-full shadow-lg md:hidden flex items-center'
          >
            Voir les matchs
            <ChevronRight className='w-4 h-4 sm:w-6 sm:h-6 ml-2' />
          </button>
        )}

        <div className='flex gap-6'>
          {viewMode === 'default' && (
            <LeftColumn onCardClick={setSelectedCard} />
          )}

          {!isMobile && (
            <RightColumn
              selectedCard={selectedCard}
              onClose={() => setSelectedCard(null)}
              loadingMatches={loading}
            />
          )}
        </div>

        {isMobile && selectedCard && (
          <div className='fixed inset-0 bg-white z-50 p-4 overflow-y-auto '>
            <div className='h-6 bg-gradient-to-t from-white/0 to-white/100 md:absolute fixed top-0 z-20 md:translate-x-0 w-full'></div>
            <QuickTradeDetails
              card={selectedCard}
              onClose={() => setSelectedCard(null)}
            />
          </div>
        )}

        {isMobile && viewMode === 'matchs' && (
          <div className='fixed inset-0 z-50 overflow-y-auto'>
            <button
              onClick={() =>
                setViewMode(viewMode === 'matchs' ? 'default' : 'matchs')
              }
              className='absolute top-5 left-0 z-50 bg-white text-gray-base sm:text-gray-lg px-4 py-2 rounded-r-full shadow-lg md:hidden flex items-center'
            >
              <ChevronLeft className='w-4 h-4 md:w-6 md:h-6 mr-2' />
              Retour aux cartes
            </button>
            <MatchList loading={loading} />
          </div>
        )}
      </ProtectedLayout>
    </ProtectedPage>
  );
}
