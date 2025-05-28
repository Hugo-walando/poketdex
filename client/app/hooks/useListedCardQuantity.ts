'use client';

import axiosClient from '@/lib/axios';
import { useUserStore } from '@/app/store/useUserStore';
import { useCollectionStore } from '@/app/store/useCollectionStore';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { useCallback } from 'react';

export function useListedCardQuantity() {
  const { user } = useUserStore();
  const {
    incrementListedCardQuantity,
    decrementListedCardQuantity,
    removeListedCardFromStore,
  } = useCollectionStore();

  const increment = useCallback(
    async (cardId: string) => {
      try {
        const res = await axiosClient.patch(
          `/api/listed-cards/${cardId}/increment`,
          {},
          {
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          },
        );
        incrementListedCardQuantity(cardId);
        return res.data;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        toast.error(
          axiosError.response?.data?.message || "Erreur lors de l'ajout.",
        );
        throw error;
      }
    },
    [user, incrementListedCardQuantity],
  );

  const decrement = useCallback(
    async (cardId: string) => {
      try {
        const res = await axiosClient.patch(
          `/api/listed-cards/${cardId}/decrement`,
          {},
          {
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          },
        );

        if (res.status === 204) {
          removeListedCardFromStore(cardId);
          return null;
        }

        decrementListedCardQuantity(cardId);

        return res.data;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        toast.error(
          axiosError.response?.data?.message ||
            'Erreur lors de la diminution de la quantité.',
        );
        throw error;
      }
    },
    [user, decrementListedCardQuantity, removeListedCardFromStore],
  );

  return {
    incrementListedCard: increment,
    decrementListedCard: decrement,
  };
}
