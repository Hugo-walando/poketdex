'use client';

import { useState } from 'react';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || 'Erreur lors de l’envoi du Magic Link');

      setMessage(
        'Un Magic Link a été envoyé à votre email. Vérifiez votre boîte de réception.',
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  return (
    <div>
      <h1>Inscription</h1>
      <form onSubmit={handleSignUp}>
        <input
          type='email'
          placeholder='Entrez votre email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type='submit'>Recevoir le Magic Link</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
