// hooks/useSocket.ts
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export default function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!socketRef.current) {
      console.log('🔌 Tentative de connexion à Socket.IO');
      const socket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ['websocket'],
      });

      socketRef.current = socket;

      socket.on('connect_error', (err) => {
        console.error('❌ Erreur de connexion Socket.IO :', err.message);
      });

      socket.on('connect', () => {
        setConnected(true);
        console.log('🟢 Connecté à Socket.IO');
      });

      socket.on('disconnect', () => {
        setConnected(false);
        console.log('🔴 Déconnecté de Socket.IO');
      });
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return { socket: socketRef.current, connected };
}
