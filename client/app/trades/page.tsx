'use client';

import { useState } from 'react';
import UserSidebar from '../components/trade/UserSideBar';
import TradeListSection from '../components/trade/TradeListSection';
import UserDetail from '../components/trade/UserDetail';
import useIsMobile from '../hooks/useIsMobile';
import { User } from '../types';

// Mock temporaire
const mockUsers: User[] = [
  {
    id: 'u1',
    username: 'AshKetchum',
    profile_picture: '/testimgs/avatars/Av1.png',
    friend_code: '1234-5678-7184-8614',
  },
  {
    id: 'u2',
    username: 'Misty',
    profile_picture: '/testimgs/avatars/Av2.png',
    friend_code: '1234-5678-7184-8614',
  },
];

export default function TradePage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const selectedUser = mockUsers.find((user) => user.id === selectedUserId);

  return (
    <div className='h-screen'>
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
        <div className='flex h-full'>
          <UserSidebar
            users={mockUsers}
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
          />

          {selectedUser && (
            <div className='flex-1'>
              {/* ✅ Affichage au-dessus sur < xl */}
              <div className='block lg:hidden mb-4'>
                <UserDetail user={selectedUser} />
              </div>

              <div className='flex flex-col lg:flex-row gap-2'>
                <div className='flex-1'>
                  <TradeListSection
                    selectedUser={selectedUser}
                    onBack={() => setSelectedUserId(null)}
                  />
                </div>

                {/* ✅ Affichage à droite sur xl+ */}
                <div className='hidden lg:block w-[280px]'>
                  <UserDetail user={selectedUser} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
