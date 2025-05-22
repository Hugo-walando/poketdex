'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Feedback } from '@/app/types';

export default function AdminFeedbackList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/feedback/feedbacks`,
        );
        setFeedbacks(res.data);
      } catch (err) {
        console.error('Erreur récupération feedbacks', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  if (loading)
    return <p className='text-sm text-gray-500'>Chargement des feedbacks...</p>;
  if (feedbacks.length === 0)
    return (
      <p className='text-sm text-gray-500'>Aucun feedback pour le moment.</p>
    );

  return (
    <div className='bg-white rounded-xl shadow-base p-4 max-w-xl w-full'>
      <h2 className='text-lg font-semibold mb-3'>Feedbacks utilisateurs</h2>
      <ul className='space-y-3 max-h-[400px] overflow-y-auto pr-1'>
        {feedbacks.map((fb) => (
          <li key={fb._id} className='border-b pb-2'>
            <div className='text-sm text-gray-500'>
              <span className='font-medium uppercase'>{fb.type}</span> •{' '}
              {new Date(fb.createdAt).toLocaleString()}
            </div>
            <p className='text-sm mt-1'>{fb.message}</p>
            <p className='text-xs text-gray-500 mt-1'>
              De : <strong>{fb.username || 'Anonyme'}</strong> ({fb.email})
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
