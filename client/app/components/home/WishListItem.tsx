import { WishlistCard } from '@/app/types';
import { Check } from 'lucide-react';
import { cn } from '@/app/utils/cn';
import Image from 'next/image';

interface WishlistItemProps {
  card: WishlistCard;
  isSelected: boolean;
  onClick: (id: string) => void;
}

export default function WishlistItem({
  card,
  isSelected,
  onClick,
}: WishlistItemProps) {
  return (
    <div
      onClick={() => onClick(card.card._id)}
      className={cn(
        'shadow-base relative items-center cursor-pointer transition-all',
      )}
    >
      <Image
        src={card.card.img_url}
        alt={card.card.name}
        width={0}
        height={0}
        sizes='100vw'
        className='h-26 w-auto'
      />
      {isSelected && (
        <div className='absolute inset-0 bg-black/50 rounded-sm flex items-center transition-all justify-center'>
          <Check className='w-8 h-8 text-white' />
        </div>
      )}
    </div>
  );
}
