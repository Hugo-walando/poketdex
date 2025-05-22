'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function FeedbackForm() {
  const { data: session } = useSession();
  const [type, setType] = useState<'problem' | 'suggestion' | 'other'>(
    'suggestion',
  );
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!session?.user?.email) {
      setError('Vous devez être connecté pour envoyer un feedback.');
      return;
    }

    if (!message.trim()) {
      setError('Le message ne peut pas être vide.');
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback`, {
        type,
        message,
        email: session.user.email,
        username: session.user.username || null,
      });
      toast.success('Merci pour votre feedback !');
      setMessage('');
    } catch (err) {
      console.error("Erreur lors de l'envoi du feedback", err);
      setError('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='max-w-md mx-auto p-4'>
      <h2 className='text-dark-lg font-bold mb-4'>Donnez votre avis</h2>

      {error && <p className='text-red-600 mb-2'>{error}</p>}

      <label className='block text-dark-sm mb-1'>Type de feedback</label>
      <select
        value={type}
        onChange={(e) =>
          setType(e.target.value as 'problem' | 'suggestion' | 'other')
        }
        className='w-full border rounded px-3 py-2 mb-4 hover:cursor-pointer text-dark-sm'
      >
        <option value='problem' className='text-dark-sm'>
          ❗ Problème
        </option>
        <option value='suggestion' className='text-dark-sm'>
          💡 Suggestion
        </option>
        <option value='other' className='text-dark-sm'>
          📩 Autre
        </option>
      </select>

      <label className='block text-dark-sm mb-1'>Message</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        className='w-full border rounded px-3 py-2 mb-4 text-dark-sm'
        placeholder='Votre message...'
      />

      <button
        type='submit'
        className='w-full bg-primarygreen text-white py-2 rounded hover:bg-primarygreen/90 hover:cursor-pointer'
      >
        Envoyer
      </button>
    </form>
  );
}
