'use client';

import Image from 'next/image';

import { HeartIcon, Search } from 'lucide-react';
import RarityRain from './components/ui/RarityRainEffect';
import CardIcon from './components/svgs/CardIcon';
import TradeIcon from './components/svgs/TradeIcon';

export default function LandingPage() {
  return (
    <div className='z-10 px-6 py-12 md:px-16 lg:px-32'>
      <RarityRain />
      <header className='text-center mb-16'>
        <h1 className=' text-darkblue text-4xl font-poppins font-bold mb-4'>
          <span className='text-primarygreen'>Échange tes cartes </span> sur{' '}
          Pokémon TCG Pocket facilement !
        </h1>
        <p className='text-bluegray text-lg font-semibold max-w-2xl mx-auto mb-4'>
          Une plateforme simple et rapide pour échanger vos cartes Pokémon TCG
          Pocket avec d{"'"}autres joueurs !
        </p>
        <a
          href='/login'
          className='inline-block bg-primarygreen text-white text-lg px-6 py-3 rounded-full shadow hover:opacity-90 transition'
        >
          Se Connecter
        </a>
      </header>

      <section className='mb-16 '>
        <h2 className='text-dark-2xl mb-4 '>Comment ça marche ?</h2>

        <div className='bg-gray-50 mb-4 p-6 rounded-2xl shadow-md z-10 flex flex-col items-center sm:flex-row sm:justify-between'>
          <div className='max-w-md'>
            <div className='flex items-center justify-center rounded-md bg-gray-200 w-10 h-10 mb-2'>
              <CardIcon className=' h-6 w-6 text-primarygreen' />
            </div>
            <h3 className='text-dark-xl mb-2'>1. Ajoutez votre collection</h3>
            <p className='text-gray-700 my-2'>
              Ajoutez les cartes que vous possédez en double et celles que vous
              souhaitez obtenir.
            </p>
            <div className='flex items-center gap-2'>
              <TradeIcon className='h-6 w-6 text-primarygreen mt-2' /> : Carte à
              échanger
            </div>
            <div className='flex items-center gap-2'>
              <HeartIcon className='h-6 w-6 fill-pink-400 text-transparent mt-2' />{' '}
              : Carte souhaitée
            </div>
          </div>
          <Image
            src='/landing/collection.png'
            alt='Ajouter des cartes'
            width={0}
            height={0}
            sizes='100vw'
            className='w-auto h-60 rounded-lg'
          />
        </div>
        <div className='bg-gray-50 mb-4 p-6 rounded-2xl shadow-md z-10 flex flex-col items-center sm:flex-row sm:justify-between'>
          <div className='max-w-md'>
            <div className='flex items-center justify-center rounded-md bg-gray-200 w-10 h-10 mb-2'>
              <Search className='h-6 w-6 text-primarygreen' />
            </div>
            <h3 className='text-dark-xl mb-2'>2. Trouvez des matchs</h3>
            <p className='text-gray-700 my-2'>
              Le système détecte automatiquement les meilleurs échanges
              possibles entre vous et d{"'"}autres joueurs.
            </p>
            <p className='text-gray-700 mt-2'>
              Vous pouvez aussi rechercher une carte et proposer un échange
              directement, <strong>sans remplir votre collection</strong>.
            </p>
          </div>
          <Image
            src='/landing/match.png'
            alt='Trouvez des Matchs'
            width={0}
            height={0}
            sizes='100vw'
            className='w-auto h-80 rounded-lg'
          />
        </div>

        <div className='bg-gray-50 mb-4 p-6 rounded-2xl shadow-md z-10 flex flex-col items-center sm:flex-row sm:justify-between'>
          <div className='max-w-md'>
            <div className='flex items-center justify-center rounded-md bg-gray-200 w-10 h-10 mb-2'>
              <TradeIcon className=' h-6 w-6 text-primarygreen' />
            </div>
            <h3 className='text-dark-xl mb-2'>3. Échangez facilement</h3>
            <p className='text-gray-700 my-2'>
              Une fois l{"'"}échange validé, vous pouvez envoyer vos cartes dans
              le jeu en ajoutant l{"'"}autre joueur en ami.
            </p>
          </div>
          <Image
            src='/landing/trade.png'
            alt='Echanger'
            width={0}
            height={0}
            sizes='100vw'
            className='w-auto h-60 rounded-lg'
          />
        </div>
      </section>

      <section className='text-center'>
        <h2 className='text-2xl font-semibold text-darkblue mb-4'>
          Prêt à échanger ?
        </h2>
        <p className='text-gray-600 mb-6'>
          Connectez-vous et commencez à compléter votre collection !
        </p>
        <a
          href='/login'
          className='inline-block bg-primarygreen text-white text-lg px-6 py-3 rounded-full shadow hover:opacity-90 transition'
        >
          Se Connecter
        </a>
      </section>
    </div>
  );
}
