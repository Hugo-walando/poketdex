'use client';

// import { useEffect, useState } from 'react';
// import { mockNotifications } from '@/app/data/mockNotifications';
// import type { Notification } from '@/app/types';
// import NotificationItem from './NotificationItem';

export default function ActivityList() {
  // const [notifications, setNotifications] = useState<Notification[]>([]);

  // useEffect(() => {
  //   // Simulation d'un fetch plus tard
  //   setNotifications(mockNotifications);
  // }, []);

  return (
    <aside className='w-full hidden md:block md:w-[300px] bg-white rounded-xl shadow-base p-4 h-[60vh] overflow-y-auto'>
      <h2 className='text-dark-xl mb-4'>Activités</h2>
      <div className='flex flex-col gap-3'>
        {/* {notifications.length === 0 ? (
          <p className='text-gray-base text-center'>Aucune activité récente</p>
        ) : (
          notifications.map((notif) => (
             <NotificationItem key={notif.id} notification={notif} />
          ))
        )} */}
      </div>
    </aside>
  );
}
