import QuickTradeDetails from './QuickTradeDetails';
import MatchList from './MatchList';
import { ListedCard } from '@/app/types';

interface RightColumnProps {
  selectedCard: ListedCard | null;
  onClose: () => void;
  loadingMatches: boolean;
}

export default function RightColumn({
  selectedCard,
  onClose,
  loadingMatches,
}: RightColumnProps) {
  return (
    <div className='bg-white rounded-xl shadow-base md:block sticky top-[22vh] h-[72vh] w-4/10 overflow-y-auto '>
      {selectedCard ? (
        <QuickTradeDetails card={selectedCard} onClose={onClose} />
      ) : (
        <MatchList loading={loadingMatches} />
      )}
    </div>
  );
}
