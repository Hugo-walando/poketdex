'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { User } from 'next-auth';
import useUpdateUser from '@/app/hooks/useUpdateUser';
import { updateUserSchema } from '@/lib/validation/user';
import { useUIModalStore } from '@/app/store/useUIModalStore';

interface CompleteProfileModalProps {
  user: User;
  onClose: () => void;
}

export default function CompleteProfileModal({
  user,
}: CompleteProfileModalProps) {
  const { isCompleteProfileModalOpen, closeCompleteProfileModal } =
    useUIModalStore(); // 👈

  const { updateUser, loading, error, success } = useUpdateUser();
  const [username, setUsername] = useState(user.username ?? '');
  const [friendCode, setFriendCode] = useState(user.friend_code ?? '');

  const [formErrors, setFormErrors] = useState<{
    username?: string[];
    friend_code?: string[];
  }>({});

  const handleSubmit = async () => {
    setFormErrors({}); // reset erreurs

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

  return (
    <Dialog
      open={isCompleteProfileModalOpen}
      onClose={closeCompleteProfileModal}
      className='relative z-50'
    >
      <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='bg-white max-w-md w-full p-6 rounded-xl shadow-lg space-y-4'>
          <Dialog.Title className='text-xl font-semibold text-dark'>
            Complète ton profil
          </Dialog.Title>

          {success && (
            <div className='text-green-600 font-medium'>{success}</div>
          )}
          {error && <div className='text-red-600 font-medium'>{error}</div>}

          <div className='space-y-3'>
            <div>
              <label className='text-sm font-medium text-gray-700'>
                Nom d’utilisateur
              </label>
              <input
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='w-full mt-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primarygreen'
                placeholder='Ton pseudo'
              />
              {formErrors.username && (
                <p className='text-sm text-red-600 mt-1'>
                  {formErrors.username[0]}
                </p>
              )}
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700'>
                Code ami
              </label>
              <input
                type='text'
                value={friendCode}
                onChange={(e) => setFriendCode(e.target.value)}
                className='w-full mt-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primarygreen'
                placeholder='1234-5678-9101-1121'
              />
              {formErrors.friend_code && (
                <p className='text-sm text-red-600 mt-1'>
                  {formErrors.friend_code[0]}
                </p>
              )}
            </div>
          </div>

          <div className='flex justify-end'>
            <button
              onClick={handleSubmit}
              className='bg-primarygreen text-white px-4 py-2 rounded-lg hover:opacity-90 transition'
            >
              {loading ? 'Mise à jour en cours...' : 'Mettre à jour'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
