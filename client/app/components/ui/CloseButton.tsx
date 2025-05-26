'use client';

import { X } from 'lucide-react';
import { cn } from '@/app/utils/cn';

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
  size?: number;
}

export default function CloseButton({
  onClick,
  className,
  size = 24,
}: CloseButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label='Fermer'
      className={cn(
        'rounded-full bg-white p-1 shadow-base hover:cursor-pointer transition-all',
        className,
      )}
    >
      <X
        className='text-darkgray hover:text-redalert'
        width={size}
        height={size}
      />
    </button>
  );
}
