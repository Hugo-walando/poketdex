'use client';

import { useState } from 'react';
import UserSidebar from '../components/trade/UserSideBar';
import TradeListSection from '../components/trade/TradeListSection';
import UserDetail from '../components/trade/UserDetail';
import useIsMobile from '../hooks/useIsMobile';
import ProtectedPage from '../components/auth/ProtectedPage';
import ProtectedLayout from '../components/auth/ProtectedLayout';
import { useTradeRequestStore } from '../store/useTradeRequestStore';
import useFetchTradeRequests from '../hooks/useFetchTradeRequests';

export default function TradePage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { tradeGroups } = useTradeRequestStore();
  const { loading, error } = useFetchTradeRequests(); // 👈 fetch trades dès l'arrivée

  const selectedGroup =
    tradeGroups.find((group) => group.user.id === selectedUserId) || null;

  if (loading) {
    return (
      <ProtectedPage>
        <ProtectedLayout>
          <div className='flex justify-center items-center h-[calc(100vh-152px)]'>
            <p className='text-gray-lg'>Chargement des échanges...</p>
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
              <div className='h-full'>
                <div className='mb-4'>
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

            {selectedGroup && (
              <div className='flex-1 px-2 flex flex-col lg:flex-row gap-2'>
                {/* UserDetail au-dessus sur mobile */}
                <div className='block lg:hidden mb-4'>
                  <UserDetail user={selectedGroup.user} />
                </div>

                {/* Liste scrollable */}
                <div className='flex-1 overflow-y-auto max-h-[calc(100vh-152px)] pr-2'>
                  <TradeListSection
                    selectedUser={selectedGroup.user}
                    trades={selectedGroup.trades}
                    onBack={() => setSelectedUserId(null)}
                  />
                </div>

                {/* UserDetail fixe à droite */}
                <div className='hidden lg:block w-[280px] shrink-0'>
                  <UserDetail user={selectedGroup.user} />
                </div>
              </div>
            )}
          </div>
        )}
      </ProtectedLayout>
    </ProtectedPage>
  );
}
