'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from 'next-auth';
import Image from 'next/image';

export default function ConnectedUsersList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchConnectedUsers = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/connected-users`,
      );
      setUsers(res.data);
    };

    fetchConnectedUsers();
  }, []);

  return (
    <div className='flex flex-col gap-4 mb-4'>
      <h2 className='text-lg font-semibold mb-2'>
        Utilisateurs connectés ({users.length})
      </h2>
      {users.length > 0 ? (
        users.map((user) => (
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
        ))
      ) : (
        <li className='text-gray-500'>Aucun utilisateur connecté</li>
      )}
    </div>
  );
}
