import { mockMatches } from '@/app/data/mockMatches';
import { MatchGroup } from '@/app/types';

export async function fetchMatchGroups(): Promise<MatchGroup[]> {
  // plus tard tu remplaceras cette ligne par un vrai fetch
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockMatches), 500);
  });
}
