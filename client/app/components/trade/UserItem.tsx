'use client';

import Image from 'next/image';
import { cn } from '@/app/utils/cn';
import UserStatusIndicator from '../ui/UserStatusIndicator';

interface UserItemProps {
  id: string;
  username: string;
  profilePicture: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  showAlertDot?: boolean;
}

export default function UserItem({
  id,
  username,
  profilePicture,
  isSelected,
  onSelect,
  showAlertDot,
}: UserItemProps) {
  return (
    <button
      onClick={() => onSelect(id)}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl shadow-base  md:shadow-none md:hover:bg-primarygreen/10 hover:cursor-pointer transition-all w-full text-left relative',
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
      {showAlertDot && (
        <div className='absolute -top-1 -right-1 h-4 w-4 bg-redalert rounded-full flex items-center justify-center'>
          <span className=' h-4 w-4 bg-redalert rounded-full animate-ping' />
        </div>
      )}
      <span className='text-dark-lg truncate'>
        {username} <UserStatusIndicator userId={id} />
      </span>
    </button>
  );
}
