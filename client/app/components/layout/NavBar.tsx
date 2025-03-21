'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HomeIcon from '@/public/icons/Home.svg';
import CardIcon from '@/public/icons/Card.svg';
import TradeIcon from '@/public/icons/Exchange.svg';
import { cn } from '@/app/utils/cn';

// Mock temporaire (à remplacer avec données réelles plus tard)
const isAuthenticated = true;
// const userAvatarUrl = '/assets/avatar.png'; // Exemple
const hasPendingTrade = true;

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: <HomeIcon className='w-6 h-6' />, label: 'Accueil' },
    {
      href: '/card',
      icon: <CardIcon className='w-6 h-6' />,
      label: 'Mes cartes',
    },
    {
      href: '/trades',
      icon: (
        <div className='relative'>
          <TradeIcon className='w-6 h-6' />
          {hasPendingTrade && (
            <span className='absolute -top-1 -right-1 h-2 w-2 bg-redalert rounded-full' />
          )}
        </div>
      ),
      label: 'Échanges',
    },
    {
      href: '/profile',
      icon: <div className='w-6 h-6 rounded-full bg-primarygreen'></div>,
      label: 'Profil',
    },
  ];

  return (
    <>
      {/* 🖥️ Desktop */}
      <nav className='hidden md:flex justify-between items-center px-6 py-4 shadow-sm'>
        <Link href='/'>
          <span className='text-dark-xl font-bold'>Pokexchange</span>
        </Link>

        <div className='flex gap-6'>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2',
                pathname === item.href && 'text-primarygreen',
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {isAuthenticated ? (
          <Link href='/profile'>
            {/* <img
              src={userAvatarUrl}
              alt='avatar'
              className='w-10 h-10 rounded-full object-cover'
            /> */}
            <div className='w-10 h-10 rounded-full bg-primarygreen'></div>
          </Link>
        ) : (
          <Link href='/auth/signup' className='text-dark-base'>
            Connexion
          </Link>
        )}
      </nav>

      {/* 📱 Mobile */}
      <nav className='md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center py-2 shadow-inner z-50'>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center text-grayblue',
              pathname === item.href && 'text-primarygreen',
            )}
          >
            {item.icon}
          </Link>
        ))}
      </nav>
    </>
  );
}
