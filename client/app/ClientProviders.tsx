'use client';

import React from 'react';
import GlobalDataLoader from '@/app/components/data/GlobalDataLoader';

interface Props {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: Props) {
  return (
    <>
      <GlobalDataLoader />
      {children}
    </>
  );
}
