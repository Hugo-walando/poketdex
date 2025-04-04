'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn('email', {
      email,
      redirect: false,
      callbackUrl: '/',
    });

    if (res?.ok) {
      alert('Un lien de connexion a été envoyé à votre email !');
    } else {
      alert('Erreur lors de la connexion.');
    }

    setLoading(false);
  };

  return (
    <main className='flex items-center justify-center h-screen w-full bg-gray-50 px-4'>
      <div className='bg-white rounded-xl shadow-base p-6 w-full max-w-md flex flex-col gap-6'>
        <h1 className='text-center text-dark-xl font-bold'>Connexion</h1>

        <form onSubmit={handleEmailSignIn} className='flex flex-col gap-4'>
          <label className='text-sm text-gray-600'>Email</label>
          <input
            type='email'
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primarygreen'
            placeholder='adresse@email.com'
          />

          <button
            type='submit'
            disabled={loading}
            className='bg-primarygreen text-white py-2 rounded-md hover:opacity-90 transition'
          >
            {loading ? 'Envoi en cours...' : 'Recevoir un lien magique'}
          </button>
        </form>

        <div className='flex items-center gap-2'>
          <hr className='flex-1 border-gray-200' />
          <span className='text-xs text-gray-400'>ou</span>
          <hr className='flex-1 border-gray-200' />
        </div>

        <div className='flex flex-col gap-2'>
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className='bg-white border text-darkgray py-2 rounded-md hover:bg-gray-50 transition'
          >
            Continuer avec Google
          </button>
          <button
            onClick={() => signIn('discord', { callbackUrl: '/' })}
            className='bg-white border text-darkgray py-2 rounded-md hover:bg-gray-50 transition'
          >
            Continuer avec Discord
          </button>
        </div>
      </div>
    </main>
  );
}
