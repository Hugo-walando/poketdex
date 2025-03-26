'use client';

import LeftColumn from './components/home/LeftColumn';

export default function Home() {
  return (
    <div className='flex gap-6'>
      <LeftColumn onCardClick={() => {}} />
    </div>
  );
}
