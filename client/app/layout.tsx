import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/NavBar';
import { SessionProvider } from 'next-auth/react';
import MaxWidthWrapper from './components/layout/MaxWidthWrapper';
import ClientProviders from './ClientProviders';
import { auth } from '@/auth';
import ScrollToTop from './components/layout/ScrollToTop';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: 'PoketDex',
  description: 'Echangez vos cartes Pokémon TCG Pocket !',
  icons: {
    icon: '/favicon.ico', // fallback standard
    shortcut: '/favicon.ico', // pour les anciens navigateurs
    apple: '/apple-touch-icon.png', // iOS
    other: [
      {
        rel: 'icon',
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        rel: 'icon',
        sizes: '192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'icon',
        sizes: '512x512',
        url: '/android-chrome-512x512.png',
      },
    ],
  },
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang='fr' className={poppins.variable}>
      <body>
        <SessionProvider session={session} refetchOnWindowFocus={false}>
          <MaxWidthWrapper>
            <Navbar />
            <Toaster position='top-right' />
            <ClientProviders>
              <ScrollToTop />
              {children}
            </ClientProviders>
          </MaxWidthWrapper>
        </SessionProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
