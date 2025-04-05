'use client';

import { useState } from 'react';
import UserSidebar from '../components/trade/UserSideBar';
import TradeListSection from '../components/trade/TradeListSection';
import UserDetail from '../components/trade/UserDetail';
import useIsMobile from '../hooks/useIsMobile';
import { mockUsers } from '../data/mockUsers';
import ProtectedPage from '../components/auth/ProtectedPage';

export default function TradePage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const selectedUser = mockUsers.find((user) => user.id === selectedUserId);

  return (
    <ProtectedPage>
      {isMobile ? (
        <div className='h-full'>
          {selectedUserId ? (
            <div className='h-full'>
              <div className='mb-4'>
                <UserDetail user={selectedUser!} />
              </div>

              <TradeListSection
                selectedUser={selectedUser!}
                onBack={() => setSelectedUserId(null)}
              />
            </div>
          ) : (
            <UserSidebar
              users={mockUsers}
              selectedUserId={selectedUserId}
              onSelectUser={setSelectedUserId}
            />
          )}
        </div>
      ) : (
        <div className='hidden md:flex h-[calc(100vh-152px)]'>
          <div className='w-[250px] border-r border-gray-200 overflow-y-auto overflow-x-hidden'>
            <UserSidebar
              users={mockUsers}
              selectedUserId={selectedUserId}
              onSelectUser={setSelectedUserId}
            />
          </div>

          {selectedUser && (
            <div className='flex-1 px-2 flex flex-col lg:flex-row gap-2'>
              {/* UserDetail au-dessus sur <lg */}
              <div className='block lg:hidden mb-4'>
                <UserDetail user={selectedUser} />
              </div>

              {/* Zone scrollable uniquement pour les échanges */}
              <div className='flex-1 overflow-y-auto max-h-[calc(100vh-152px)] pr-2'>
                <TradeListSection
                  selectedUser={selectedUser}
                  onBack={() => setSelectedUserId(null)}
                />
              </div>

              {/* UserDetail à droite sur lg+ → en dehors du scroll */}
              <div className='hidden lg:block w-[280px] shrink-0'>
                <UserDetail user={selectedUser} />
              </div>
            </div>
          )}
        </div>
      )}
    </ProtectedPage>
  );
}
