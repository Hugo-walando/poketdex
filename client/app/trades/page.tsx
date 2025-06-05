'use client';

import { useEffect, useRef, useState } from 'react';
import UserSidebar from '../components/trade/UserSideBar';
import TradeListSection from '../components/trade/TradeListSection';
import UserDetail from '../components/trade/UserDetail';
import useIsMobile from '../hooks/useIsMobile';
import ProtectedPage from '../components/auth/ProtectedPage';
import ProtectedLayout from '../components/auth/ProtectedLayout';
import { useTradeRequestStore } from '../store/useTradeRequestStore';
import useFetchTradeRequests from '../hooks/useFetchTradeRequests';
import { useSearchParams, useRouter } from 'next/navigation';
import Loader from '../components/ui/Loader';
import { useUserStore } from '../store/useUserStore';

export default function TradePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentUserId = useUserStore((s) => s.user?.id);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { tradeGroups } = useTradeRequestStore();
  const markTradeStatusAsSeen = useTradeRequestStore(
    (s) => s.markTradeStatusAsSeen,
  );

  const { loading } = useFetchTradeRequests();
  const cleanedUrl = useRef(false);

  const selectedGroup =
    tradeGroups.find((group) => group.user._id === selectedUserId) || null;

  useEffect(() => {
    if (!selectedGroup || !currentUserId) return;

    selectedGroup.trades.forEach((t) => {
      const shouldMarkSeen =
        (t.status === 'pending' && t.receiver._id === currentUserId) ||
        (t.status === 'accepted' && t.sender._id === currentUserId) ||
        (t.status === 'completed' &&
          t.receiver._id === currentUserId &&
          t.sent_by_sender &&
          t.sent_by_receiver);

      if (shouldMarkSeen) {
        markTradeStatusAsSeen(t._id, t.status);
      }
    });
  }, [selectedGroup, currentUserId, markTradeStatusAsSeen]);

  useEffect(() => {
    const preselectedUserId = searchParams.get('user');
    if (preselectedUserId) {
      setSelectedUserId(preselectedUserId);
      if (!cleanedUrl.current) {
        router.replace('/trades', { scroll: false });
        cleanedUrl.current = true;
      }
    }
  }, [searchParams, router]);
  useEffect(() => {
    if (isMobile) {
      window.scrollTo({ top: 0 });
    }
  }, [selectedUserId, isMobile]);

  if (loading) {
    return (
      <ProtectedPage>
        <ProtectedLayout>
          <div className='flex justify-center items-center h-[calc(100vh-152px)]'>
            <p className='text-gray-lg'>Chargement des échanges...</p>
            <Loader />
          </div>
        </ProtectedLayout>
      </ProtectedPage>
    );
  }

  if (tradeGroups.length === 0) {
    return (
      <ProtectedPage>
        <ProtectedLayout>
          <div className='flex justify-center items-center h-[calc(100vh-152px)] px-4 text-center'>
            <p className='text-gray-xl'>
              Aucun échange disponible pour le moment.
              <br />
              Ajoutez des cartes à votre collection ou votre wishlist pour
              commencer à échanger !
            </p>
          </div>
        </ProtectedLayout>
      </ProtectedPage>
    );
  }

  return (
    <ProtectedPage>
      <ProtectedLayout>
        {isMobile ? (
          <div className='h-full'>
            {selectedUserId && selectedGroup ? (
              <div className='h-full relative'>
                <div className='mb-4 sticky top-0 left-0 z-20'>
                  <UserDetail user={selectedGroup.user} />
                </div>
                <TradeListSection
                  selectedUser={selectedGroup.user}
                  trades={selectedGroup.trades}
                  onBack={() => setSelectedUserId(null)}
                />
              </div>
            ) : (
              <UserSidebar
                users={tradeGroups.map((g) => g.user)}
                selectedUserId={selectedUserId}
                onSelectUser={setSelectedUserId}
              />
            )}
          </div>
        ) : (
          <div className='hidden md:flex h-[calc(100vh-152px)]'>
            <div className='w-[250px] border-r border-gray-200 overflow-y-auto overflow-x-hidden'>
              <UserSidebar
                users={tradeGroups.map((g) => g.user)}
                selectedUserId={selectedUserId}
                onSelectUser={setSelectedUserId}
              />
            </div>

            {selectedGroup ? (
              <div className='flex-1 px-2 flex flex-col lg:flex-row gap-2'>
                <div className='block lg:hidden pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-rounded '>
                  <UserDetail user={selectedGroup.user} />
                </div>
                <div className='flex-1 overflow-y-auto max-h-[calc(100vh-152px)] pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-rounded  '>
                  <TradeListSection
                    selectedUser={selectedGroup.user}
                    trades={selectedGroup.trades}
                    onBack={() => setSelectedUserId(null)}
                  />
                </div>
                <div className='hidden lg:block w-[280px] shrink-0'>
                  <UserDetail user={selectedGroup.user} />
                </div>
              </div>
            ) : (
              <div className='flex-1 flex justify-center items-center text-gray-xl'>
                Sélectionnez un utilisateur pour voir les échanges.
              </div>
            )}
          </div>
        )}
      </ProtectedLayout>
    </ProtectedPage>
  );
}
