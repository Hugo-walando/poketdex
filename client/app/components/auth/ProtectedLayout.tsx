'use client';

import { useEffect, useState } from 'react';
import { isProfileIncomplete } from '@/app/utils/isProfileIncomplete';
import CompleteProfileModal from './CompleteProfileModal';
import { useUserStore } from '@/app/store/useUserStore';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUserStore((state) => state.user);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user && isProfileIncomplete(user)) {
      setShowModal(true);
    }
  }, [user]);

  return (
    <>
      {showModal && (
        <CompleteProfileModal
          user={user!}
          onClose={() => setShowModal(false)}
        />
      )}
      {children}
    </>
  );
}
