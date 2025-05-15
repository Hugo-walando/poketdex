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
  const markAsSent = useTradeRequestStore((s) => s.markAsSent);
  const setTradeActive = useTradeRequestStore((s) => s.setTradeActive);
  const updateUser = useUserStore((s) => s.updateUserStore);

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
        }
      });

      socket.on('disconnect', () => {
        setConnected(false);
      });

      socket.on('connect_error', (err) => {
        console.error('❌ Erreur Socket.IO :', err.message);
      });

      socket.on('user-connected', (id) => {
        addOnlineUser(id);
      });

      socket.on('user-disconnected', (id) => {
        removeOnlineUser(id);
      });
      socket.on('connected-users', (ids: string[]) => {
        setAll(ids);
        // Tu peux stocker ça dans un Zustand Store par exemple
      });

      socket.on('new-trade-request', (tradeRequest) => {
        // Optionnel : ajoute dans un store (ex: `useTradeRequestStore`)
        addTradeRequest(tradeRequest);
        // Optionnel : affiche une notification/toast
        toast('📩 Nouvelle demande d’échange reçue');
      });

      socket.on('trade-updated', (data) => {
        updateTradeStatus(data.tradeId, data.status);
        if (data.status === 'accepted') {
          toast('🎉 Une de vos demandes d`échange a été accepté !');
        } else if (data.status === 'declined') {
          toast('❌ Une de vos demandes d`échange a été refusé.');
        } else if (data.status === 'cancelled') {
          toast('❌ Une de vos demandes d`échange a été annulé.');
        }
      });

      socket.on('trade-sent-update', ({ tradeId, sentByUserId }) => {
        markAsSent(tradeId, sentByUserId);

        // ✅ On ne notifie que si c’est l’autre qui a envoyé
        if (sentByUserId !== userId) {
          toast('📦 Tu as reçu une carte !');
        }
      });
      socket.on('trade-reactivated', ({ tradeId }) => {
        setTradeActive(tradeId); // une méthode zustand qui met is_active à true
      });
    } else {
      if (socketRef.current.connected && userId) {
        socketRef.current.emit('register-user', userId);
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
    markAsSent,
    setTradeActive,
    updateUser,
  ]);

  return { socket: socketRef.current, connected };
}
