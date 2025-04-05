'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { isProfileIncomplete } from '@/app/utils/isProfileIncomplete';
import CompleteProfileModal from './CompleteProfileModal';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (session?.user && isProfileIncomplete(session.user)) {
      setShowModal(true);
    }
  }, [session]);

  return (
    <>
      {showModal && (
        <CompleteProfileModal
          user={session!.user}
          onClose={() => setShowModal(false)}
        />
      )}
      {children}
    </>
  );
}
