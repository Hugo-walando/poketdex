'use client';

import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { User } from 'next-auth';

interface CompleteProfileModalProps {
  user: User;
  onClose: () => void;
}

export default function CompleteProfileModal({
  user,
  onClose,
}: CompleteProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState(user.username ?? '');
  const [friendCode, setFriendCode] = useState(user.friend_code ?? '');

  useEffect(() => {
    const missingFields = !user.username || !user.friend_code;
    setIsOpen(missingFields);
  }, [user]);

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`, // à adapter si tu veux passer le token dans le header
          },
          body: JSON.stringify({ username, friend_code: friendCode }),
        },
      );

      if (!res.ok) throw new Error('Erreur lors de la mise à jour du profil');

      onClose();
    } catch (err) {
      console.error(err);
      alert("Une erreur s'est produite");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-50'>
      <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='bg-white max-w-md w-full p-6 rounded-xl shadow-lg space-y-4'>
          <Dialog.Title className='text-xl font-semibold text-dark'>
            Complète ton profil
          </Dialog.Title>

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
            </div>
          </div>

          <div className='flex justify-end'>
            <button
              onClick={handleSubmit}
              className='bg-primarygreen text-white px-4 py-2 rounded-lg hover:opacity-90 transition'
            >
              Enregistrer
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
