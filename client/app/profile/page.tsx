'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import useUpdateUser from '@/app/hooks/useUpdateUser';
import LogoutButton from '../components/ui/LogoutButton';
import ProtectedPage from '../components/auth/ProtectedPage';

export default function Profile() {
  const { data: session } = useSession();
  const { updateUser, error, success, loading } = useUpdateUser();

  const [username, setUsername] = useState('');
  const [friendCode, setFriendCode] = useState('');

  useEffect(() => {
    if (session?.user) {
      setUsername(session.user.username || '');
      setFriendCode(session.user.friend_code || '');
    }
  }, [session]);

  const handleSave = async () => {
    const userData = {
      username: username,
      friend_code: friendCode,
    };

    await updateUser(userData);
  };

  if (!session) return null;

  return (
    <ProtectedPage>
      <div className='p-4 max-w-md mx-auto space-y-4'>
        <h2 className='text-xl font-semibold'>
          Bienvenue {session.user.email}
        </h2>
        <LogoutButton />
        {success && <div className='alert alert-success'>{success}</div>}
        {error && <div className='alert alert-danger'>{error}</div>}

        <div>
          <label className='block mb-1'>Pseudo</label>
          <input
            type='text'
            className='w-full p-2 border rounded'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className='block mb-1'>Code Ami</label>
          <input
            type='text'
            className='w-full p-2 border rounded'
            value={friendCode}
            onChange={(e) => setFriendCode(e.target.value)}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50'
        >
          {loading ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>
    </ProtectedPage>
  );
}
