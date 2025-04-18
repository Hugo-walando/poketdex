'use client';

import { useMatchStore } from '@/app/store/useMatchStore';

const useRemoveMatchesByCard = () => {
  const { matchGroups, setMatches } = useMatchStore();

  const removeMatchesByCard = (cardId: string) => {
    const updatedGroups = matchGroups
      .map((group) => ({
        ...group,
        trades: group.trades.filter(
          (trade) =>
            trade.offered_card._id !== cardId &&
            trade.requested_card._id !== cardId,
        ),
      }))
      .filter((group) => group.trades.length > 0); // ⚡ supprime les groupes vides

    setMatches(updatedGroups); // 🔥
  };

  return { removeMatchesByCard };
};

export default useRemoveMatchesByCard;
