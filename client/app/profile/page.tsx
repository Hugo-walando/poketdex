'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import useUpdateUser from '@/app/hooks/useUpdateUser';
import LogoutButton from '../components/ui/LogoutButton';
import ProtectedPage from '../components/auth/ProtectedPage';
import { updateUserSchema } from '@/lib/validation/user';

export default function Profile() {
  const { data: session } = useSession();
  const { updateUser, error, success, loading } = useUpdateUser();

  const [username, setUsername] = useState('');
  const [friendCode, setFriendCode] = useState('');
  const [formErrors, setFormErrors] = useState<{
    username?: string[];
    friend_code?: string[];
  }>({});

  useEffect(() => {
    if (session?.user) {
      setUsername(session.user.username || '');
      setFriendCode(session.user.friend_code || '');
    }
  }, [session]);

  const handleSave = async () => {
    setFormErrors({}); // Réinitialise les erreurs

    const result = updateUserSchema.safeParse({
      username,
      friend_code: friendCode,
    });

    if (!result.success) {
      setFormErrors(result.error.flatten().fieldErrors);
      return;
    }

    const validData = result.data;

    await updateUser({
      username: validData.username,
      friend_code: validData.friend_code,
    });
  };

  if (!session) return null;

  return (
    <ProtectedPage>
      <div className='p-4 max-w-md mx-auto space-y-4'>
        <h2 className='text-xl font-semibold'>
          Bienvenue {session.user.email}
        </h2>
        <LogoutButton />

        {success && <div className='text-green-600 font-medium'>{success}</div>}
        {error && <div className='text-red-600 font-medium'>{error}</div>}

        <div>
          <label className='block mb-1'>Pseudo</label>
          <input
            type='text'
            className='w-full p-2 border rounded'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {formErrors.username && (
            <p className='text-sm text-red-600 mt-1'>
              {formErrors.username[0]}
            </p>
          )}
        </div>

        <div>
          <label className='block mb-1'>Code Ami</label>
          <input
            type='text'
            className='w-full p-2 border rounded'
            value={friendCode}
            onChange={(e) => setFriendCode(e.target.value)}
          />
          {formErrors.friend_code && (
            <p className='text-sm text-red-600 mt-1'>
              {formErrors.friend_code[0]}
            </p>
          )}
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
