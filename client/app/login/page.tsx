'use client';

// import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  // const [email, setEmail] = useState('');
  // const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
  //   'idle',
  // );

  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   setStatus('sending');

  //   const res = await signIn('resend', {
  //     email,
  //     redirect: false,
  //   });

  //   if (!res?.ok) {
  //     console.error('🚨 Erreur côté client lors du signIn:', res?.error);
  //     setStatus('error');
  //   }

  //   setStatus('sent');
  // };

  const handleGoogleSignIn = () => {
    signIn('google', { redirect: false }); // Connexion via Google
  };

  return (
    <div className='flex items-center justify-center'>
      <div className='w-full max-w-md bg-white shadow-xl rounded-2xl p-6 sm:p-10'>
        <h1 className='text-dark-2xl text-center mb-6 font-semibold'>
          Connexion à Poketdex
        </h1>

        {/* {status === 'error' && (
          <p className='text-red-500 text-center'>
            ❌ Une erreur est survenue lors de l&apos;envoi du lien de
            connexion.
          </p>
        )} */}

        {/* {status === 'sent' ? (
          <p className='text-gray-base text-center'>
            📬 Un lien de connexion a été envoyé à{' '}
            <span className='font-semibold'>{email}</span>.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-4'>
            <label className='block'>
              <span className='text-gray-base'>Adresse email</span>
              <input
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primarygreen'
                placeholder='tonemail@example.com'
              />
            </label>

            <button
              type='submit'
              disabled={status === 'sending'}
              className='w-full py-2 bg-primarygreen text-white rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60'
            >
              {status === 'sending' ? 'Envoi en cours...' : 'Se connecter'}
            </button>
          </form>
        )} */}

        {/* Ajout du bouton Google */}
        <div className='mt-4'>
          <button
            onClick={handleGoogleSignIn}
            className='w-full py-2 bg-blue-500 text-white rounded-xl font-semibold hover:opacity-90 transition'
          >
            Se connecter avec Google
          </button>
        </div>
      </div>
    </div>
  );
}
