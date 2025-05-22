'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useOnlineUserStore } from '@/app/store/useUserOnlineStore';

interface User {
  id: string;
  username: string;
  profile_picture: string;
}

export default function ConnectedUsersList() {
  const onlineUserIds = useOnlineUserStore((s) => s.onlineUsers);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchConnectedUserDetails = async () => {
      if (onlineUserIds.length === 0) {
        setUsers([]);
        return;
      }

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/connected-users`,
          { userIds: onlineUserIds },
        );
        setUsers(res.data);
      } catch (err) {
        console.error('Erreur récupération utilisateurs connectés', err);
      }
    };

    fetchConnectedUserDetails();
  }, [onlineUserIds]);

  return (
    <div className='flex flex-col gap-4 mb-4'>
      <h2 className='text-lg font-semibold mb-2'>
        Utilisateurs connectés ({users.length})
      </h2>
      {users.length > 0 ? (
        <ul className='space-y-1'>
          {users.map((user) => (
            <li key={user.id} className='flex items-center gap-2'>
              <Image
                alt={user.username || 'Image'}
                src={user.profile_picture || '/avatars/Av1.png'}
                width={24}
                height={24}
                sizes='100vw'
                className='w-6 h-6 rounded-full'
              />
              <span>{user.username}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className='text-gray-500'>Aucun utilisateur connecté</p>
      )}
    </div>
  );
}
