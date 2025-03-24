'use client';

import { cn } from '@/app/utils/cn';
import React from 'react';

interface MaxWidthWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function MaxWidthWrapper({
  children,
  className,
}: MaxWidthWrapperProps) {
  return (
    <div
      className={cn('mx-auto w-full max-w-screen-xl px-4 md:px-6', className)}
    >
      {children}
    </div>
  );
}
