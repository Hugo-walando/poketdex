'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { User } from 'next-auth';
import useUpdateUser from '@/app/hooks/useUpdateUser';
import { updateUserSchema } from '@/lib/validation/user';
import { useUIModalStore } from '@/app/store/useUIModalStore';
import Input from '@/app/components/ui/Input';

interface CompleteProfileModalProps {
  user: User;
  onClose: () => void;
}

export default function CompleteProfileModal({
  user,
}: CompleteProfileModalProps) {
  const { isCompleteProfileModalOpen, closeCompleteProfileModal } =
    useUIModalStore();

  const { updateUser, loading, error, success } = useUpdateUser();
  const [username, setUsername] = useState(user.username ?? '');
  const [friendCode, setFriendCode] = useState(user.friend_code ?? '');

  const [formErrors, setFormErrors] = useState<{
    username?: string[];
    friend_code?: string[];
  }>({});

  const handleSubmit = async () => {
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
          <Dialog.Title className='text-dark-xl'>
            Complète ton profil
          </Dialog.Title>

          {success && (
            <div className='text-green-600 font-medium'>{success}</div>
          )}
          {error && <div className='text-red-600 font-medium'>{error}</div>}

          <div className='space-y-3'>
            <Input
              label='Pseudo'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={formErrors.username?.[0]}
              placeholder='Ton pseudo sur le jeu'
            />

            <Input
              label='Code ami'
              type='text'
              value={friendCode}
              onChange={(e) => setFriendCode(e.target.value)}
              error={formErrors.friend_code?.[0]}
              placeholder='1234-5678-9101-1121'
            />
          </div>

          <div className='flex justify-end'>
            <button
              onClick={handleSubmit}
              className='bg-primarygreen text-white font-poppins px-4 py-2 rounded-lg hover:opacity-90 transition'
            >
              {loading ? 'Mise à jour en cours...' : 'Mettre à jour'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
