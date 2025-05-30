'use client';

import { useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

interface Job {
  jobId: string;
  name: string;
  userId?: string;
  cardId?: string;
  mode?: string;
}

export default function AdminJobsQueue() {
  const socketRef = useRef<Socket | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!socketRef.current) {
      const socket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ['websocket'],
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        setConnected(true);
      });

      socket.on('disconnect', () => {
        setConnected(false);
      });

      socket.on('connect_error', (err) => {
        console.error('❌ Erreur Socket.IO :', err.message);
      });

      socket.on('job:started', (job: Job) => {
        setJobs((prev) => [...prev, job]);
      });

      socket.on('job:finished', ({ jobId }: { jobId: string }) => {
        setJobs((prev) => prev.filter((job) => job.jobId !== jobId));
      });

      socket.on('job:failed', ({ jobId }: { jobId: string }) => {
        setJobs((prev) => prev.filter((job) => job.jobId !== jobId));
      });
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  if (!connected)
    return <p className='text-sm text-gray-500'>Connexion au socket...</p>;

  return (
    <div className='p-4 border rounded-md bg-white shadow'>
      <h2 className='font-semibold text-lg mb-2'>Jobs en file d’attente</h2>
      {jobs.length === 0 ? (
        <p className='text-sm text-gray-500'>Aucun job en cours.</p>
      ) : (
        <ul className='space-y-1 text-sm'>
          {jobs.map((job) => (
            <li key={job.jobId} className='text-gray-800'>
              🔧 <strong>{job.name}</strong> pour user <code>{job.userId}</code>{' '}
              — carte <code>{job.cardId}</code> (mode: <code>{job.mode}</code>)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
