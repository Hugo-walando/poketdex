'use client';

import React from 'react';
import GlobalDataLoader from '@/app/components/data/GlobalDataLoader';
import CollectionLoader from './components/data/CollectionDataLoader';
import SocketProvider from './components/data/SocketProvider';
import TradeDataLoader from './components/data/TradeDataLoader';

interface Props {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: Props) {
  return (
    <>
      <SocketProvider />
      <GlobalDataLoader />
      <CollectionLoader />
      <TradeDataLoader />

      {children}
    </>
  );
}
