'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Pen } from 'lucide-react';
import { useUserStore } from '@/app/store/useUserStore';
import useUpdateUser from '@/app/hooks/useUpdateUser';
import { updateUserSchema } from '@/lib/validation/user';
import ProtectedPage from '../components/auth/ProtectedPage';
import LogoutButton from '../components/ui/LogoutButton';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';
import AvatarSelectorModal from '../components/ui/AvataSelectorModal';

const DEFAULT_AVATAR = '/avatars/Av1.png';

export default function Profile() {
  const user = useUserStore((state) => state.user);
  const { updateUser, loading, error, success } = useUpdateUser();

  const [username, setUsername] = useState('');
  const [friendCode, setFriendCode] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATAR);
  const [showModal, setShowModal] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    username?: string[];
    friend_code?: string[];
  }>({});

  // 🔄 Initialisation des champs
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setFriendCode(user.friend_code || '');
      setSelectedAvatar(user.profile_picture || DEFAULT_AVATAR);
    }
  }, [user]);

  const normalizeFriendCode = (code: string) => code.replace(/\D/g, '');

  const handleSave = useCallback(async () => {
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
    const normalizedFriendCode = normalizeFriendCode(validData.friend_code);
    const normalizedCurrentCode = normalizeFriendCode(user?.friend_code || '');

    const hasChanged =
      validData.username !== user?.username ||
      normalizedFriendCode !== normalizedCurrentCode ||
      selectedAvatar !== (user?.profile_picture || DEFAULT_AVATAR);

    if (!hasChanged) {
      toast.error('Aucun changement détecté');
      return;
    }

    const updated = await updateUser({
      username: validData.username,
      friend_code: validData.friend_code,
    });

    if (updated) {
      setShowModal(false); // ✅ Fermer modale
    }
  }, [username, friendCode, selectedAvatar, user, updateUser]);

  if (!user) return null;

  return (
    <ProtectedPage>
      <div className='p-4 max-w-lg mx-auto space-y-6'>
        {/* 🧑 Avatar & titre */}
        <div className='flex items-center justify-between'>
          <div className='relative'>
            <Image
              src={selectedAvatar}
              alt='Avatar'
              width={0}
              height={0}
              sizes='100vw'
              className='rounded-full h-24 w-auto'
            />
            <button
              className='bg-white rounded-full shadow-base flex items-center justify-center w-8 h-8 absolute -top-2 -right-2 hover:bg-gray-200 transition'
              onClick={() => setShowModal(true)}
            >
              <Pen className='w-6 h-6 text-grayblue' />
            </button>
          </div>
          <h2 className='text-dark-base truncate '>
            Bienvenue {user.username}
          </h2>
          <LogoutButton />
        </div>

        {/* ✅ Feedback */}
        {success && (
          <div className='text-primarygreen font-medium'>{success}</div>
        )}
        {error && <div className='text-red-alert font-medium'>{error}</div>}

        {/* 📝 Formulaire */}
        <Input
          label='Pseudo'
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={formErrors.username?.[0]}
        />
        <Input
          label='Code Ami'
          type='text'
          value={friendCode}
          onChange={(e) => setFriendCode(e.target.value)}
          error={formErrors.friend_code?.[0]}
        />

        <button
          onClick={handleSave}
          disabled={loading}
          className='w-full py-2 bg-primarygreen text-white rounded-xl font-poppins hover:bg-primarygreen/80 transition disabled:opacity-60'
        >
          {loading ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>

      {/* 🖼️ Modal de sélection d'avatar */}
      <AvatarSelectorModal
        isOpen={showModal}
        selectedAvatar={selectedAvatar}
        onClose={() => setShowModal(false)}
        onSelect={(path) => setSelectedAvatar(path)}
        onSave={async () => {
          await updateUser({ profile_picture: selectedAvatar });
          setShowModal(false);
        }}
      />
    </ProtectedPage>
  );
}
