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
        'flex items-center gap-3 px-4 py-3 rounded-xl shadow-base  md:shadow-none md:hover:bg-primarygreen/10 hover:cursor-pointer transition-all w-full text-left',
        isSelected && 'md:bg-primarygreen/40 md:hover:bg-primarygreen/40',
      )}
    >
      <Image
        src={profilePicture}
        alt={username}
        width={0}
        height={0}
        sizes='100vw'
        className='rounded-full h-10 w-10 '
      />
      <span className='text-dark-lg truncate'>{username}</span>
    </button>
  );
}
