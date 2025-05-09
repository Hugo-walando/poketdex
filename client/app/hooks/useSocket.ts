// hooks/useSocket.ts
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUserStore } from '../store/useUserStore';
import { useOnlineUserStore } from '../store/useUserOnlineStore';
import toast from 'react-hot-toast';
import { useTradeRequestStore } from '../store/useTradeRequestStore';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export default function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const user = useUserStore((state) => state.user);
  const userId = user?.id;

  const addOnlineUser = useOnlineUserStore((s) => s.add);
  const removeOnlineUser = useOnlineUserStore((s) => s.remove);
  const setAll = useOnlineUserStore((s) => s.setAll);
  const addTradeRequest = useTradeRequestStore((s) => s.addTradeRequest);
  const updateTradeStatus = useTradeRequestStore((s) => s.updateTradeStatus);

  useEffect(() => {
    if (!userId) return;
    if (!socketRef.current) {
      const socket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ['websocket'],
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        setConnected(true);
        if (userId) {
          socket.emit('register-user', userId);
          console.log('🟢 Connecté à Socket.IO et enregistré :', userId);
        }
      });

      socket.on('disconnect', () => {
        setConnected(false);
        console.log('🔴 Déconnecté de Socket.IO');
      });

      socket.on('connect_error', (err) => {
        console.error('❌ Erreur Socket.IO :', err.message);
      });

      socket.on('user-connected', (id) => {
        console.log('✅ User connecté', id);
        addOnlineUser(id);
      });

      socket.on('user-disconnected', (id) => {
        console.log('❌ User déconnecté', id);
        removeOnlineUser(id);
      });
      socket.on('connected-users', (ids: string[]) => {
        console.log('📥 Utilisateurs actuellement connectés :', ids);
        setAll(ids);
        // Tu peux stocker ça dans un Zustand Store par exemple
      });

      socket.on('new-trade-request', (tradeRequest) => {
        console.log('📩 Nouvelle demande d’échange reçue :', tradeRequest);

        // Optionnel : ajoute dans un store (ex: `useTradeRequestStore`)
        addTradeRequest(tradeRequest);
        // Optionnel : affiche une notification/toast
        toast('📩 Nouvelle demande d’échange reçue');
      });

      socket.on('trade-updated', (data) => {
        console.log('♻️ TradeRequest mise à jour :', data);

        updateTradeStatus(data.tradeId, data.status);
      });
    } else {
      if (socketRef.current.connected && userId) {
        socketRef.current.emit('register-user', userId);
        console.log('✅ User enregistré après connexion :', userId);
      }
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, [
    userId,
    addOnlineUser,
    removeOnlineUser,
    setAll,
    addTradeRequest,
    updateTradeStatus,
  ]);

  return { socket: socketRef.current, connected };
}
