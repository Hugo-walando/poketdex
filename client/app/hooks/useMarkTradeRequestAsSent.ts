'use client';

import axiosClient from '@/lib/axios';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useUserStore } from '@/app/store/useUserStore';
import { useTradeRequestStore } from '@/app/store/useTradeRequestStore';

export default function useMarkTradeRequestAsSent() {
  const { user } = useUserStore();
  const { updateSentStatus } = useTradeRequestStore(); // un petit update de ton state côté front

  const markAsSent = async (tradeRequestId: string) => {
    try {
      await axiosClient.patch(
        `/api/trade-requests/${tradeRequestId}/mark-sent`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        },
      );
      updateSentStatus(tradeRequestId); // tu mets à jour localement
      toast.success('Carte marquée comme envoyée ✅');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const backendMessage =
        axiosError.response?.data?.message || 'Erreur lors du marquage.';
      toast.error(backendMessage);
      throw error;
    }
  };

  return { markAsSent };
}
