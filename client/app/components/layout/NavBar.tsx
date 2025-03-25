'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/utils/cn';
import HomeIcon from '../svgs/HomeIcon'; // Adjust the path to the correct location of HomeIcon
import CardIcon from '../svgs/CardIcon';

// Mock temporaire (à remplacer avec données réelles plus tard)
const isAuthenticated = true;
// const userAvatarUrl = '/assets/avatar.png'; // Exemple
const hasPendingTrade = true;

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      icon: <HomeIcon className={cn('w-6 h-6')} />,
      label: 'Accueil',
    },
    {
      href: '/card',
      icon: <CardIcon className={cn('w-6 h-6')} />,
      label: 'Mes cartes',
    },
    {
      href: '/trades',
      icon: (
        <div className='relative'>
          <CardIcon className={cn('w-6 h-6')} />
          {hasPendingTrade && (
            <span className='absolute -top-1 -right-1 h-2 w-2 bg-redalert rounded-full' />
          )}
        </div>
      ),
      label: 'Échanges',
    },
  ];

  return (
    <>
      {/* 🖥️ Desktop */}
      <nav className='hidden md:flex justify-between items-center px-6 py-4 shadow-base bg-white mt-10 rounded-2xl'>
        <div className='flex gap-16'>
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn('flex items-center ')}
              >
                <span
                  className={cn(
                    'flex items-center gap-2',
                    isActive ? 'text-green-xl' : 'text-gray-xl',
                  )}
                >
                  {item.icon}
                  {item.label}
                </span>
              </Link>
            );
          })}
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
      <nav className='md:hidden fixed bottom-0 w-full bg-white border-gray-200 flex justify-around items-center py-6 shadow-inner z-50'>
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
