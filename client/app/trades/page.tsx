// app/trades/page.tsx

'use client';

import { useState } from 'react';
import UserSidebar from '../components/trade/UserSideBar';
import TradeListSection from '../components/trade/TradeListSection';
import ActivityList from '../components/trade/ActivityList';
import useIsMobile from '../hooks/useIsMobile';
import { Users, Repeat, Bell } from 'lucide-react';

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
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'users' | 'trades' | 'activity'>(
    'trades',
  );

  return (
    <div className='relative flex flex-col h-screen'>
      {/* Affichage desktop avec layout classique */}
      {!isMobile && (
        <div className='flex flex-1'>
          <UserSidebar
            users={mockUsers}
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
          />
          <TradeListSection />
          <ActivityList />
        </div>
      )}

      {/* Affichage mobile avec tabs */}
      {isMobile && (
        <div className='flex-1 overflow-y-auto'>
          {activeTab === 'users' && (
            <UserSidebar
              users={mockUsers}
              selectedUserId={selectedUserId}
              onSelectUser={setSelectedUserId}
            />
          )}
          {activeTab === 'trades' && <TradeListSection />}
          {activeTab === 'activity' && <ActivityList />}
        </div>
      )}

      {/* Footer avec tabs (uniquement mobile) */}
      {isMobile && (
        <div className='fixed top-0 mb-10 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 z-50'>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex flex-col items-center ${
              activeTab === 'users' ? 'text-primarygreen' : 'text-darkgray'
            }`}
          >
            <Users className='w-5 h-5 mb-1' />
            <span className='text-xs'>Utilisateurs</span>
          </button>
          <button
            onClick={() => setActiveTab('trades')}
            className={`flex flex-col items-center ${
              activeTab === 'trades' ? 'text-primarygreen' : 'text-darkgray'
            }`}
          >
            <Repeat className='w-5 h-5 mb-1' />
            <span className='text-xs'>Échanges</span>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex flex-col items-center ${
              activeTab === 'activity' ? 'text-primarygreen' : 'text-darkgray'
            }`}
          >
            <Bell className='w-5 h-5 mb-1' />
            <span className='text-xs'>Activité</span>
          </button>
        </div>
      )}
    </div>
  );
}
