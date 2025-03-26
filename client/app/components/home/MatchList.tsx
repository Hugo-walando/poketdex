'use client';

import Image from 'next/image';

export default function MatchList() {
  const mockMatches = [
    {
      id: 'm1',
      cardName: 'Dracolosse',
      img_url: '/testimgs/cards/Bulbizarre.png',
    },
    {
      id: 'm2',
      cardName: 'Lugia',
      img_url: '/testimgs/cards/Herbizarre.png',
    },
  ];

  return (
    <div className='p-4 '>
      <h2 className='text-dark-xl mb-4'>Matchs automatiques</h2>

      {mockMatches.length === 0 ? (
        <p className='text-gray-xl text-center'>Aucun match pour l'instant</p>
      ) : (
        <div className='flex flex-col gap-4'>
          {mockMatches.map((match) => (
            <div
              key={match.id}
              className='flex items-center gap-4 p-3 bg-gray-50 rounded-lg shadow-sm'
            >
              <Image
                src={match.img_url}
                alt={match.cardName}
                width={0}
                height={0}
                sizes='100vw'
                className='w-16 h-auto rounded-md'
              />
              <div className='text-dark-base font-semibold'>
                {match.cardName}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
