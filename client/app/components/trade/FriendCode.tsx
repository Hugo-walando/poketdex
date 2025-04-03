'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/app/utils/cn';

interface FriendCodeProps {
  code: string;
  className?: string;
}

export default function FriendCode({ code, className }: FriendCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'flex items-center gap-4 bg-lightgray rounded-xl sm:px-4 sm:py-2 w-full max-w-[320px] hover:cursor-pointer sm:hover:bg-gray-100 transition',
        className,
      )}
      aria-label='Copier le code ami'
    >
      <span className='text-dark-sm sm:text-dark-base'>{code}</span>
      {copied ? (
        <Check className='w-5 h-5 text-primarygreen' />
      ) : (
        <Copy className='w-5 h-5 text-darkgray' />
      )}
    </button>
  );
}
