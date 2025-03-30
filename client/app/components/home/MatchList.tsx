'use client';

import { mockMatches } from '@/app/data/mockMatches';
import Image from 'next/image';

export default function MatchList() {
  return (
    <div className='mt-14 md:mt-0 w-full'>
      {mockMatches.length === 0 ? (
        <p className='text-gray-xl text-center'>Aucun match pour l`instant</p>
      ) : (
        <div className='flex flex-col items-center gap-4 px-4'>
          <h2 className='text-dark-xl mb-2 text-right'>Matchs</h2>
          {mockMatches.map((match) => (
            <div
              key={match.id}
              className='w-full flex items-center gap-4 px-4 py-4 bg-white rounded-xl shadow-base 
'
            >
              <div className='flex pl-2'>
                <Image
                  src={match.requested_card.img_url}
                  alt={match.requested_card.name}
                  width={0}
                  height={0}
                  sizes='100vw'
                  className='w-20 h-auto rounded-md'
                />
                <div className='flex flex-col w-10 items-center'>
                  <h3 className='text-dark-base font-semibold'>
                    {match.requested_card.official_id}
                  </h3>
                  <Image
                    src={match.requested_card.set_img}
                    alt={match.requested_card.name}
                    width={0}
                    height={0}
                    sizes='100vw'
                    className='h-4 w-auto'
                  />
                </div>
              </div>
              <div className='flex pr-1'>
                <div className='flex flex-col w-10 items-center'>
                  <h3 className='text-dark-base font-semibold'>
                    {match.offered_card.official_id}
                  </h3>
                  <Image
                    src={match.offered_card.set_img}
                    alt={match.offered_card.name}
                    width={0}
                    height={0}
                    sizes='100vw'
                    className='h-4 w-auto'
                  />
                </div>
                <Image
                  src={match.offered_card.img_url}
                  alt={match.offered_card.name}
                  width={0}
                  height={0}
                  sizes='100vw'
                  className='w-20 h-auto rounded-md'
                />
              </div>
              <div className='flex flex-col items-center'>
                <Image
                  src={match.user.profile_picture}
                  alt={match.user.username}
                  width={32}
                  height={32}
                  className='rounded-full'
                />
                <span className='text-dark-base'>{match.user.username}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
