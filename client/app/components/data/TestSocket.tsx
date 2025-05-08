'use client';

import useSocket from '@/app/hooks/useSocket';

export default function TestSocket() {
  const { socket, connected } = useSocket();

  return (
    <div>
      <p>Status Socket.IO : {connected ? '🟢 Connecté' : '🔴 Déconnecté'}</p>
      <button
        onClick={() => {
          socket?.emit('hello', 'Coucou serveur 👋');
          console.log('Message envoyé au serveur');
        }}
        className='bg-blue-500 text-white px-4 py-2 rounded hover:cursor-pointer'
      >
        Envoyer un test
      </button>
    </div>
  );
}
