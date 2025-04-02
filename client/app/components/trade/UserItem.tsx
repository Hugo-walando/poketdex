'use client';

import Image from 'next/image';
import { cn } from '@/app/utils/cn';

interface UserItemProps {
  id: string;
  username: string;
  profilePicture: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function UserItem({
  id,
  username,
  profilePicture,
  isSelected,
  onSelect,
}: UserItemProps) {
  return (
    <button
      onClick={() => onSelect(id)}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-all w-full text-left',
        isSelected && 'bg-primarygreen/10',
      )}
    >
      <Image
        src={profilePicture}
        alt={username}
        width={32}
        height={32}
        className='rounded-full'
      />
      <span className='text-dark-base font-medium truncate'>{username}</span>
    </button>
  );
}
