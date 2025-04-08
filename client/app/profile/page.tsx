'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import useUpdateUser from '@/app/hooks/useUpdateUser';
import LogoutButton from '../components/ui/LogoutButton';
import ProtectedPage from '../components/auth/ProtectedPage';

export default function Profile() {
  const { data: session } = useSession();
  const { updateUser } = useUpdateUser();

  const [username, setUsername] = useState('');
  const [friendCode, setFriendCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (session?.user) {
      setUsername(session.user.username || '');
      setFriendCode(session.user.friend_code || '');
    }
  }, [session]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateUser({
        username,
        friend_code: friendCode,
      });
      setMessage('✅ Profil mis à jour !');
    } catch (error) {
      console.error('Erreur de mise à jour utilisateur :', error);
      setMessage('❌ Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  return (
    <ProtectedPage>
      <div className='p-4 max-w-md mx-auto space-y-4'>
        <h2 className='text-xl font-semibold'>
          Bienvenue {session.user.email}
        </h2>
        <LogoutButton />

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

        {message && <p className='text-sm mt-2'>{message}</p>}
      </div>
    </ProtectedPage>
  );
}
