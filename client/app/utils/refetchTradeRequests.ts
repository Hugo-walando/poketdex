import axiosClient from '@/lib/axios';
import { groupTradeRequestsByUser } from '@/app/utils/groupTradeRequests';
import { useTradeRequestStore } from '@/app/store/useTradeRequestStore';

export const refetchTradeRequests = async (
  accessToken: string,
  userId: string,
) => {
  try {
    console.log('📡 Refetch manuel des trade requests...');
    const res = await axiosClient.get('/api/trade-requests/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const grouped = groupTradeRequestsByUser(res.data, userId);
    useTradeRequestStore.getState().setTradeGroups(grouped);

    console.log('✅ Refetch terminé, groupes :', grouped.length);
  } catch (err) {
    console.error('❌ Erreur lors du refetch manuel :', err);
  }
};
