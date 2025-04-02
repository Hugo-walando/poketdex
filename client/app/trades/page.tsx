// app/trades/page.tsx

'use client';

import { useState } from 'react';
import UserSidebar from '../components/trade/UserSideBar';
import TradeListSection from '../components/trade/TradeListSection';
import ActivityList from '../components/trade/ActivityList';

// Mock temporaire
const mockUsers = [
  {
    id: 'u1',
    username: 'AshKetchum',
    profile_picture: '/testimgs/avatars/Av1.png',
  },
  {
    id: 'u2',
    username: 'Misty',
    profile_picture: '/testimgs/avatars/Av2.png',
  },
];

export default function TradePage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    mockUsers[0].id,
  );

  return (
    <div className='flex h-screen'>
      {/* Sidebar Utilisateurs */}
      <UserSidebar
        users={mockUsers}
        selectedUserId={selectedUserId}
        onSelectUser={setSelectedUserId}
      />

      {/* Panneau d’échange */}
      <TradeListSection />

      {/* Liste d’activité */}
      <ActivityList />
    </div>
  );
}
