'use client';

import { useTradeRequestStore } from '@/app/store/useTradeRequestStore';
import { useUserStore } from '@/app/store/useUserStore';
import axiosClient from '@/lib/axios';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export function useTradeRequestActions() {
  const { user } = useUserStore();
  const { updateTradeStatus } = useTradeRequestStore();

  const respondToTradeRequest = async (
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
  };

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
  };
}
