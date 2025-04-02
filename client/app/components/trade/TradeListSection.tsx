'use client';

import TradeItem from './TradeItem';

// Temporaire : mock de données (à remplacer avec l'appel au backend)
const mockTrades = [
  {
    id: '1',
    type: 'sent',
    user: {
      id: '123',
      username: 'PokeAlex',
      profile_picture: '/assets/user1.png',
    },
    card_offered: {
      id: '101',
      name: 'Pikachu EX',
      img_url: '/testimgs/cards/PikachuEx.png',
      official_id: '113/226',
    },
    card_requested: {
      id: '202',
      name: 'Dracaufeu EX',
      img_url: '/testimgs/cards/DracaufeuEx.png',
      official_id: '034/226',
    },
    status: 'pending',
  },
  // ... d'autres échanges ici
];

export default function TradeListSection() {
  return (
    <section className='flex-1 px-4 py-6'>
      <h2 className='text-dark-xl mb-4'>Demandes et Échanges</h2>
      <div className='space-y-4'>
        {mockTrades.map((trade) => (
          <TradeItem key={trade.id} trade={trade} />
        ))}
      </div>
    </section>
  );
}
