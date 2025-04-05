'use client';

import { Loader2 } from 'lucide-react'; // ou tout autre icône spinner
import React from 'react';

export default function Loader() {
  return (
    <div className='flex items-center justify-center h-screen w-full'>
      <Loader2 className='animate-spin text-primarygreen w-10 h-10' />
    </div>
  );
}
