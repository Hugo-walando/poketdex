'use client';

import useSocket from '@/app/hooks/useSocket';

export default function SocketProvider() {
  useSocket(); // Pas besoin de rendu, on déclenche juste le hook
  return null; // Aucun rendu
}
