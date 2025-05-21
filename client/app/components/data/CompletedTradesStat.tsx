'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CompletedTradesStat() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCompletedTrades = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/completed-trades-count`,
        );
        setCount(res.data.count);
      } catch (err) {
        console.error('Erreur récupération completed trades', err);
      }
    };

    fetchCompletedTrades();
  }, []);

  return (
    <div className='flex gap-4'>
      <h2 className='text-lg font-semibold'>Échanges complétés :</h2>
      <p className='text-2xl font-bold text-green-600'>
        {count !== null ? count : '...'}
      </p>
    </div>
  );
}
