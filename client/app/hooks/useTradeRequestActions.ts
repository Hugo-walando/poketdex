'use client';

import { useTradeRequestStore } from '@/app/store/useTradeRequestStore';
import { useUserStore } from '@/app/store/useUserStore';
import axiosClient from '@/lib/axios';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useCallback } from 'react';
import { logErrorToSentry } from '../utils/logErrorToSentry';

export function useTradeRequestActions() {
  const { user } = useUserStore();
  const { updateTradeStatus } = useTradeRequestStore();

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
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;

        const backendMessage =
          axiosError.response?.data?.message ||
          "Erreur lors de la mise à jour de l'échange.";
        toast.error(backendMessage);
        logErrorToSentry(err, {
          feature: 'useRespondToTradeRequest',
          userId: user!.id!,
        });
      }
    },
    [user, updateTradeStatus],
  );

  const toggleMarkTradeRequestAsSent = useCallback(
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

        toast.success('État d’envoi mis à jour ✅');
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        const backendMessage =
          axiosError.response?.data?.message ||
          'Erreur lors de la mise à jour de l’état d’envoi';
        toast.error(backendMessage);
        logErrorToSentry(err, {
          feature: 'useToggleMarkTradeRequestAsSent',
          userId: user!.id!,
        });
      }
    },
    [user],
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
    toggleMarkTradeRequestAsSent,
  };
}
