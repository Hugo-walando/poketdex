'use client';

import { Loader2 } from 'lucide-react';
import React from 'react';

export default function Loader() {
  return (
    <div className='flex items-center justify-center h-20 w-20 bg-white shadow-base mx-auto rounded-xl my-6 '>
      <Loader2 className='animate-spin text-primarygreen w-10 h-10' />
    </div>
  );
}
