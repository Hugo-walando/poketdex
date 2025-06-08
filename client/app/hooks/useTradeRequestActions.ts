'use client';

import { useTradeRequestStore } from '@/app/store/useTradeRequestStore';
import { useUserStore } from '@/app/store/useUserStore';
import axiosClient from '@/lib/axios';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useCallback } from 'react';

export function useTradeRequestActions() {
  const { user } = useUserStore();
  const { updateTradeStatus, toggleMarkAsSent } = useTradeRequestStore();

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
          toggleMarkAsSent(tradeRequestId, user.id);
        }

        toast.success('État d’envoi mis à jour ✅');
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const backendMessage =
          axiosError.response?.data?.message ||
          'Erreur lors de la mise à jour de l’état d’envoi';
        toast.error(backendMessage);
        throw error;
      }
    },
    [user, toggleMarkAsSent],
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
