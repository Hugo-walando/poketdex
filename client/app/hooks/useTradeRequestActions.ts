'use client';

import { useTradeRequestStore } from '@/app/store/useTradeRequestStore';
import { useUserStore } from '@/app/store/useUserStore';
import axiosClient from '@/lib/axios';

export function useTradeRequestActions() {
  const { user } = useUserStore();
  const { updateTradeStatus } = useTradeRequestStore();

  const acceptTradeRequest = async (tradeRequestId: string) => {
    try {
      await axiosClient.patch(
        `/api/trade-requests/${tradeRequestId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        },
      );
      updateTradeStatus(tradeRequestId, 'accepted');
    } catch (error) {
      console.error('Erreur acceptation trade request', error);
      throw error;
    }
  };

  const declineTradeRequest = async (tradeRequestId: string) => {
    try {
      await axiosClient.patch(
        `/api/trade-requests/${tradeRequestId}/decline`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        },
      );
      updateTradeStatus(tradeRequestId, 'declined');
    } catch (error) {
      console.error('Erreur refus trade request', error);
      throw error;
    }
  };

  const cancelTradeRequest = async (tradeRequestId: string) => {
    try {
      await axiosClient.patch(
        `/api/trade-requests/${tradeRequestId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        },
      );
      updateTradeStatus(tradeRequestId, 'cancelled');
    } catch (error) {
      console.error('Erreur annulation trade request', error);
      throw error;
    }
  };

  return {
    acceptTradeRequest,
    declineTradeRequest,
    cancelTradeRequest,
  };
}
