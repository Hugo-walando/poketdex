'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { AdminStatsType, TopCardEntry } from '@/app/types';
import Image from 'next/image';

export default function AdminStats() {
  const [stats, setStats] = useState<AdminStatsType | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`,
      );
      setStats(res.data);
    };
    fetchStats();
  }, []);

  if (!stats) return <div>Chargement des statistiques...</div>;

  return (
    <div className='space-y-6'>
      {/* Tuiles */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <Stat label='👥 Utilisateurs totaux' value={stats.users.total} />
        <Stat label='🟢 Connectés' value={stats.users.connected} />
        <Stat label='🆕 Nouveaux (7j)' value={stats.users.recent} />
        <Stat label='✅ Échanges complétés' value={stats.trades.completed} />
        <Stat label='⏳ Échanges actifs' value={stats.trades.active} />
        <Stat label='❌ Échanges annulés' value={stats.trades.cancelled} />
        <Stat label='🃏 Cartes listées' value={stats.cards.listed} />
        <Stat label='🎯 Cartes en wishlist' value={stats.cards.wishlist} />
        <Stat label='🤝 Matchs générés' value={stats.matches.total} />
      </div>

      {/* Top cartes */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <TopCards
          title='Top 5 cartes en Wishlist'
          data={stats.cards.topWishlist}
        />
        <TopCards title='Top 5 cartes listées' data={stats.cards.topListed} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className='bg-white p-4 rounded shadow text-center'>
      <p className='text-sm text-gray-600'>{label}</p>
      <p className='text-2xl font-bold text-primary'>{value}</p>
    </div>
  );
}

function TopCards({ title, data }: { title: string; data: TopCardEntry[] }) {
  return (
    <div className='bg-white p-4 rounded shadow'>
      <h2 className='text-lg font-semibold mb-2'>{title}</h2>
      <table className='w-full text-sm'>
        <thead>
          <tr className='text-left border-b'>
            <th className='py-1'>#</th>
            <th className='py-1'>Carte</th>
            <th className='py-1 text-right'>Demandes</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={entry.official_id + entry.set_code} className='border-b'>
              <td className='py-1'>{index + 1}</td>
              <td className='py-1 flex items-center gap-2'>
                <Image
                  src={entry.img_url}
                  alt={entry.name}
                  width={0}
                  height={0}
                  sizes='100vw'
                  className='w-8 h-8 object-contain rounded'
                />
                <div>
                  <div className='font-medium'>{entry.name}</div>
                  <div className='text-xs text-gray-500'>
                    {entry.set_code} - #{entry.official_id}
                  </div>
                </div>
              </td>
              <td className='py-1 text-right'>{entry.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
