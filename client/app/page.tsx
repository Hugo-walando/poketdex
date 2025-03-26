'use client';

import LeftColumn from './components/home/LeftColumn';
import MaxWidthWrapper from './components/layout/MaxWidthWrapper';

export default function Home() {
  return (
    <MaxWidthWrapper>
      <div className='flex gap-6'>
        <LeftColumn onCardClick={() => {}} />
      </div>
    </MaxWidthWrapper>
  );
}
