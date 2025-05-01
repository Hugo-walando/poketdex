'use client';

import { useTradeRequestStore } from '@/app/store/useTradeRequestStore';
import { useUserStore } from '@/app/store/useUserStore';
import axiosClient from '@/lib/axios';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useCallback } from 'react';
import { refetchTradeRequests } from '../utils/refetchTradeRequests';

export function useTradeRequestActions() {
  console.log('🔄 Chargement des actions de trade');
  const { user } = useUserStore();
  const { updateTradeStatus, markAsSent } = useTradeRequestStore();

  const respondToTradeRequest = useCallback(
    async (
      tradeRequestId: string,
      newStatus: 'accepted' | 'declined' | 'cancelled',
    ) => {
      try {
        await axiosClient.patch(
          `/api/trade-requests/${tradeRequestId}`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          },
        );
        updateTradeStatus(tradeRequestId, newStatus);
        if (user?.accessToken && user?.id) {
          await refetchTradeRequests(user.accessToken, user.id);
        }
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;

        const backendMessage =
          axiosError.response?.data?.message ||
          "Erreur lors de la mise à jour de l'échange.";
        toast.error(backendMessage);
        throw error;
      }
    },
    [user, updateTradeStatus],
  );

  const markTradeRequestAsSent = useCallback(
    async (tradeRequestId: string) => {
      try {
        await axiosClient.patch(
          `/api/trade-requests/${tradeRequestId}/mark-as-sent`,
          {},
          {
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          },
        );
        if (user?.id) {
          markAsSent(tradeRequestId, user.id);
        }
        toast.success('Carte marquée comme envoyée ✅');
        // Ici tu fais le fetch manuellement si besoin
        // -> pas besoin de lier `useFetchTradeRequests` au moment de charger le hook
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const backendMessage =
          axiosError.response?.data?.message ||
          'Erreur lors du marquage de la carte comme envoyée';
        toast.error(backendMessage);
        throw error;
      }
    },
    [user, markAsSent],
  );

  const acceptTradeRequest = (tradeRequestId: string) =>
    respondToTradeRequest(tradeRequestId, 'accepted');
  const declineTradeRequest = (tradeRequestId: string) =>
    respondToTradeRequest(tradeRequestId, 'declined');
  const cancelTradeRequest = (tradeRequestId: string) =>
    respondToTradeRequest(tradeRequestId, 'cancelled');

  return {
    acceptTradeRequest,
    declineTradeRequest,
    cancelTradeRequest,
    markTradeRequestAsSent,
  };
}
