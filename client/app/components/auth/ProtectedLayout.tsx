'use client';

import { useEffect } from 'react';
import { isProfileIncomplete } from '@/app/utils/isProfileIncomplete';
import CompleteProfileModal from './CompleteProfileModal';
import { useUserStore } from '@/app/store/useUserStore';
import { useUIModalStore } from '@/app/store/useUIModalStore'; // 👈 Import ton UI store

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUserStore((state) => state.user);
  const isModalOpen = useUIModalStore(
    (state) => state.isCompleteProfileModalOpen,
  );
  const openModal = useUIModalStore((state) => state.openCompleteProfileModal);
  const closeModal = useUIModalStore(
    (state) => state.closeCompleteProfileModal,
  );

  useEffect(() => {
    if (!user) return;

    if (isProfileIncomplete(user)) {
      console.log('🔴 Profil incomplet → ouverture modale globale');
      openModal();
    } else {
      console.log('🟢 Profil complet');
      closeModal();
    }
  }, [user, user?.username, user?.friend_code, openModal, closeModal]);

  return (
    <>
      {isModalOpen && (
        <CompleteProfileModal user={user!} onClose={closeModal} />
      )}
      {children}
    </>
  );
}
