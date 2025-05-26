'use client';

import useSocket from '@/app/hooks/useSocket';

export default function SocketProvider() {
  useSocket();
  return null;
}
