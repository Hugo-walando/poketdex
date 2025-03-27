import { WishlistCard } from '@/app/types';
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
      onClick={() => onClick(card.id)}
      className={cn(
        'rounded-xl bg-gray-100 p-2 shadow-sm flex flex-col items-center cursor-pointer transition-all',
        isSelected ? 'ring-2 ring-primarygreen' : 'hover:ring-1 ring-grayblue',
      )}
    >
      <Image
        src={card.img_url}
        alt={card.name}
        width={100}
        height={130}
        className='mx-auto'
      />
      <p className='text-center text-sm mt-1'>{card.name}</p>
    </div>
  );
}
