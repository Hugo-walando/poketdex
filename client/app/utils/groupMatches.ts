import { Match, MatchGroup } from '@/app/types';

export function groupMatchesByUser(
  matches: Match[],
  currentUserId: string,
): MatchGroup[] {
  const groups: Record<string, MatchGroup> = {};

  for (const match of matches) {
    const isCurrentUser1 = match.user_1._id === currentUserId;
    const opponent = isCurrentUser1 ? match.user_2 : match.user_1;

    if (!groups[opponent._id]) {
      groups[opponent._id] = {
        user: {
          _id: opponent._id,
          username: opponent.username,
          profile_picture: opponent.profile_picture || '/avatars/Av1.png', // CHANGE THIS TO opponent.profile_picture
        },
        trades: [],
      };
    }

    groups[opponent._id].trades.push({
      _id: match._id,
      offered_card: isCurrentUser1
        ? match.card_offered_by_user_1
        : match.card_offered_by_user_2,
      requested_card: isCurrentUser1
        ? match.card_offered_by_user_2
        : match.card_offered_by_user_1,
      status: match.status,
    });
  }

  return Object.values(groups);
}
