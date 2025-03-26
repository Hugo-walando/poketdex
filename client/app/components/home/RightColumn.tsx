import QuickTradeDetails from './QuickTradeDetails';
import MatchList from './MatchList';
import { ListedCard } from '@/app/types';

interface RightColumnProps {
  selectedCard: ListedCard | null;
  onClose: () => void;
}

export default function RightColumn({
  selectedCard,
  onClose,
}: RightColumnProps) {
  return (
    <div className='bg-white rounded-xl shadow-base h-[50vh] md:block w-4/10'>
      {selectedCard ? (
        <QuickTradeDetails card={selectedCard} onClose={onClose} />
      ) : (
        <MatchList />
      )}
    </div>
  );
}
