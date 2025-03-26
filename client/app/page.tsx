'use client';

import { useState } from 'react';
import LeftColumn from './components/home/LeftColumn';
import RightColumn from './components/home/RightColumn';
import { ListedCard } from './types';

export default function Home() {
  const [selectedCard, setSelectedCard] = useState<ListedCard | null>(null);

  return (
    <div className='flex gap-6'>
      <LeftColumn onCardClick={setSelectedCard} />
      <RightColumn
        selectedCard={selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </div>
  );
}
