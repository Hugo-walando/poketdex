'use client';

import { useState } from 'react';
import UserSidebar from '../components/trade/UserSideBar';
import TradeListSection from '../components/trade/TradeListSection';
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
            <TradeListSection
              selectedUser={selectedUser!}
              onBack={() => setSelectedUserId(null)}
            />
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
            <TradeListSection
              selectedUser={selectedUser}
              onBack={() => setSelectedUserId(null)}
            />
          )}

          {/* ActivityList sera réintégré plus tard ici */}
        </div>
      )}
    </div>
  );
}
