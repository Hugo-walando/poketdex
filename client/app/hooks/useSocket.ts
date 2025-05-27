import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUserStore } from '../store/useUserStore';
import { useOnlineUserStore } from '../store/useUserOnlineStore';
import toast from 'react-hot-toast';
import { useTradeRequestStore } from '../store/useTradeRequestStore';
import { useCollectionStore } from '../store/useCollectionStore';

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
  const removeWishlistCardFromStore = useCollectionStore(
    (s) => s.removeWishlistCardFromStore,
  );
  const decrementListedCardQuantity = useCollectionStore(
    (s) => s.decrementListedCardQuantity,
  );

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
      });

      socket.on('new-trade-request', (tradeRequest) => {
        addTradeRequest(tradeRequest);

        toast('📩 Nouvelle demande d’échange reçue');
      });

      socket.on('trade-updated', (data) => {
        updateTradeStatus(data.tradeId, data.status);

        if (data.status === 'accepted') {
          toast('🎉 Une de vos demandes d’échange a été acceptée !');
        } else if (data.status === 'declined') {
          toast('❌ Une de vos demandes d’échange a été refusée.');
        } else if (data.status === 'cancelled') {
          toast('❌ Une de vos demandes d’échange a été annulée.');
        }
      });
      socket.on(
        'trade-completed',
        ({ removedWishlistCardIds, updatedListedCardIds }) => {
          // 🔁 Supprimer les wishlist cards concernées
          removedWishlistCardIds.forEach((cardId: string) => {
            removeWishlistCardFromStore(cardId);
          });

          // 🔁 Décrémenter les listed cards concernées
          updatedListedCardIds.forEach((cardId: string) => {
            decrementListedCardQuantity(cardId);
          });

          toast('✅ Échange complété : collection mise à jour');
        },
      );

      socket.on('trade-sent-update', ({ tradeId, sentByUserId }) => {
        markAsSent(tradeId, sentByUserId);

        if (sentByUserId !== userId) {
          toast('📦 Tu as reçu une carte !');
        }
      });
      socket.on('trade-reactivated', ({ tradeId }) => {
        setTradeActive(tradeId);
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
    decrementListedCardQuantity,
    removeWishlistCardFromStore,
  ]);

  return { socket: socketRef.current, connected };
}
