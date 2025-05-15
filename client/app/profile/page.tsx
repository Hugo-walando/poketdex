'use client';

import { useState, useEffect } from 'react';
import useUpdateUser from '@/app/hooks/useUpdateUser';
import LogoutButton from '../components/ui/LogoutButton';
import ProtectedPage from '../components/auth/ProtectedPage';
import { updateUserSchema } from '@/lib/validation/user';
import { useUserStore } from '../store/useUserStore';
import Input from '../components/ui/Input';

export default function Profile() {
  const { updateUser, error, success, loading } = useUpdateUser();
  const user = useUserStore((state) => state.user);

  const [username, setUsername] = useState('');
  const [friendCode, setFriendCode] = useState('');
  const [formErrors, setFormErrors] = useState<{
    username?: string[];
    friend_code?: string[];
  }>({});

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setFriendCode(user.friend_code || '');
    }
  }, [user]);

  const handleSave = async () => {
    setFormErrors({});

    const result = updateUserSchema.safeParse({
      username,
      friend_code: friendCode,
    });

    if (!result.success) {
      setFormErrors(result.error.flatten().fieldErrors);
      return;
    }

    const validData = result.data;

    const updated = await updateUser({
      username: validData.username,
      friend_code: validData.friend_code,
    });

    if (updated) {
      setUsername(updated.username);
      setFriendCode(updated.friend_code);
    }
  };

  if (!user) return null;

  return (
    <ProtectedPage>
      <div className='p-4 max-w-md mx-auto space-y-6 '>
        <div className='flex items-center justify-between'>
          <h2 className='text-dark-xl'>Bienvenue {user.username}</h2>
          <LogoutButton />
        </div>

        {success && (
          <div className='text-primarygreen font-medium'>{success}</div>
        )}
        {error && <div className='text-red-alert font-medium'>{error}</div>}

        <div>
          <Input
            label='Pseudo'
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={formErrors.username?.[0]}
          />
        </div>

        <div>
          <Input
            label='Code Ami'
            type='text'
            value={friendCode}
            onChange={(e) => setFriendCode(e.target.value)}
            error={formErrors.friend_code?.[0]}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className='w-full py-2 bg-primarygreen text-white rounded-xl font-poppins hover:bg-primarygreen/80 transition disabled:opacity-60'
        >
          {loading ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>
    </ProtectedPage>
  );
}
