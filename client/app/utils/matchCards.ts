import { Card, Set } from '../types/index';

export function matchCard(
  card: Card,
  set: Set | undefined,
  searchQuery: string,
): boolean {
  if (!searchQuery) return true;

  const query = searchQuery.toLowerCase();
  const nameMatch = card.name?.toLowerCase().includes(query);

  const officialIdStr = String(card.official_id).padStart(3, '0');
  const idMatch = officialIdStr.includes(query);

  const fullId = set ? `${officialIdStr}/${set.card_count}` : officialIdStr;
  const fullIdMatch = fullId.includes(query);

  return nameMatch || idMatch || fullIdMatch;
}
