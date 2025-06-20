'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/utils/cn';
import HomeIcon from '../svgs/HomeIcon';
import CardIcon from '../svgs/CardIcon';
import TradeIcon from '../svgs/TradeIcon';
import { useUserStore } from '@/app/store/useUserStore';
import { useTradeRequestStore } from '@/app/store/useTradeRequestStore';
import Image from 'next/image';
import { User } from 'lucide-react';

export default function Navbar() {
  const user = useUserStore((s) => s.user);
  const isAuthenticated = !!user;
  const pathname = usePathname();

  const hasImportantTradeActivity = useTradeRequestStore((s) =>
    s.hasImportantTradeActivity(user?.id || ''),
  );

  const navItems = [
    {
      href: '/home',
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
            <div className='absolute -top-1 -right-1 h-2 w-2 bg-redalert rounded-full flex items-center justify-center'>
              <span className=' h-2 w-2 bg-redalert rounded-full animate-ping' />
            </div>
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
            {user?.profile_picture && (
              <Image
                src={user.profile_picture}
                width={0}
                height={0}
                sizes='100vw'
                alt='Avatar'
                className={cn(
                  'rounded-full h-10 w-10',
                  pathname === '/profile' && 'border-2 border-primarygreen',
                )}
              />
            )}
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
            {user?.profile_picture && (
              <Image
                src={user.profile_picture}
                width={0}
                height={0}
                sizes='100vw'
                alt='Avatar'
                className={cn(
                  'rounded-full h-10 w-10',
                  pathname === '/profile' && 'border-2 border-primarygreen',
                )}
              />
            )}
          </Link>
        ) : (
          <Link href='/login'>
            <User className='w-6 h-6 text-dark-base' />
          </Link>
        )}
      </nav>
    </>
  );
}
