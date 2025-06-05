'use client';

import RarityRain from '../components/ui/RarityRainEffect';

export default function LandingPage() {
  return (
    <div className='z-10 px-6 py-12 md:px-16 lg:px-32'>
      <RarityRain />
      <header className='text-center mb-16'>
        <h1 className=' text-darkblue text-4xl font-poppins font-bold mb-4'>
          Bienvenue sur <span className='text-primarygreen'>PoketDex</span>
        </h1>
        <p className='text-bluegray text-lg font-semibold max-w-2xl mx-auto'>
          Une plateforme simple et rapide pour échanger vos cartes Pokémon TCG
          Pocket avec d'autres joueurs !
        </p>
      </header>

      <section className='mb-16 '>
        <h2 className='text-2xl font-semibold text-darkblue mb-4'>
          Comment ça marche ?
        </h2>
        <div className='grid md:grid-cols-3 gap-8'>
          <div className='bg-gray-50 p-6 rounded-2xl shadow-md z-10'>
            <h3 className='text-xl font-semibold mb-2'>
              1. Créez votre collection
            </h3>
            <p className='text-gray-700'>
              Ajoutez les cartes que vous possédez en double et celles que vous
              souhaitez obtenir.
            </p>
          </div>
          <div className='bg-gray-50 p-6 rounded-2xl shadow-md z-10'>
            <h3 className='text-xl font-semibold mb-2'>
              2. Trouvez des matchs
            </h3>
            <p className='text-gray-700'>
              Le système détecte automatiquement les meilleurs échanges
              possibles entre vous et d'autres joueurs.
            </p>
          </div>
          <div className='bg-gray-50 p-6 rounded-2xl shadow-md z-10'>
            <h3 className='text-xl font-semibold mb-2'>
              3. Échangez facilement
            </h3>
            <p className='text-gray-700'>
              Une fois l'échange validé, vous pouvez envoyer vos cartes dans le
              jeu en ajoutant l'autre joueur en ami.
            </p>
          </div>
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
