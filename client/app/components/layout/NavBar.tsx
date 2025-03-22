'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import HomeIcon from '@/public/icons/Home.svg';
// import CardIcon from '@/public/icons/Card.svg';
// import TradeIcon from '@/public/icons/Exchange.svg';
import { cn } from '@/app/utils/cn';

// Mock temporaire (à remplacer avec données réelles plus tard)
const isAuthenticated = true;
// const userAvatarUrl = '/assets/avatar.png'; // Exemple
const hasPendingTrade = true;

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      icon: <div className='w-6 h-6 bg-primarygreen'></div>,
      label: 'Accueil',
    },
    {
      href: '/card',
      icon: <div className='w-6 h-6 bg-primarygreen'></div>,
      label: 'Mes cartes',
    },
    {
      href: '/trades',
      icon: (
        <div className='relative'>
          <div className='w-6 h-6 bg-primarygreen'></div>
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
      label: '',
    },
  ];

  return (
    <>
      {/* 🖥️ Desktop */}
      <nav className='hidden md:flex justify-between items-center px-6 py-4 shadow-base bg-white mt-10 rounded-2xl'>
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
              <span
                className={cn(
                  pathname === item.href ? 'text-green-xl' : 'text-gray-xl',
                )}
              >
                {item.label}
              </span>
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
      <nav className='md:hidden absolute bottom-0 w-full bg-white border-gray-200 flex justify-around items-center py-6 shadow-inner z-50'>
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
