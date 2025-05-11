'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/utils/cn';
import HomeIcon from '../svgs/HomeIcon'; // Adjust the path to the correct location of HomeIcon
import CardIcon from '../svgs/CardIcon';
import TradeIcon from '../svgs/TradeIcon';
import { useUserStore } from '@/app/store/useUserStore';
import { useTradeRequestStore } from '@/app/store/useTradeRequestStore';

// const userAvatarUrl = '/assets/avatar.png'; // Exemple

export default function Navbar() {
  const user = useUserStore((s) => s.user);
  const isAuthenticated = !!user;
  const pathname = usePathname();

  const hasImportantTradeActivity = useTradeRequestStore((s) =>
    s.hasImportantTradeActivity(user?.id || ''),
  );

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
          <TradeIcon className={cn('w-6 h-6')} />
          {hasImportantTradeActivity && (
            <span className='absolute -top-1 -right-1 h-2 w-2 bg-redalert rounded-full animate-ping' />
          )}
        </div>
      ),
      label: 'Échanges',
    },
  ];

  return (
    <>
      {/* 🖥️ Desktop */}
      <nav className='hidden md:flex justify-between items-center px-10 py-4 shadow-base bg-white md:my-10 rounded-2xl'>
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
            <div className='w-10 h-10 rounded-full bg-primarygreen'></div>
          </Link>
        ) : (
          <Link href='/login' className='text-dark-base font-medium'>
            S’authentifier
          </Link>
        )}
      </nav>

      {/* 📱 Mobile */}
      <nav className='md:hidden fixed bottom-0 left-0 w-full bg-white border-gray-200 flex justify-around items-center py-6 shadow-inner z-100'>
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
        {isAuthenticated ? (
          <Link href='/profile'>
            <div className='w-10 h-10 rounded-full bg-primarygreen'></div>
          </Link>
        ) : (
          <Link href='/login' className='text-dark-base font-medium'>
            S’authentifier
          </Link>
        )}
      </nav>
    </>
  );
}
