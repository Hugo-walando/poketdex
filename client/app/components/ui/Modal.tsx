'use client';

import { cn } from '@/app/utils/cn';
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div
        className='absolute inset-0  bg-black/25 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className={cn(
          'relative z-50 bg-white rounded-2xl shadow-lg p-6 max-w-md w-full mx-4',
          className,
        )}
      >
        {title && (
          <h2 className='text-dark-2xl mb-4 text-center font-semibold'>
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
