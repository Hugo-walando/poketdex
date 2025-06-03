'use client';

import { useUserStore } from '@/app/store/useUserStore';
import useFetchTradeRequests from '@/app/hooks/useFetchTradeRequests';

export default function TradeDataLoader() {
  const { user } = useUserStore();
  useFetchTradeRequests(!!user?.accessToken);

  return null;
}
