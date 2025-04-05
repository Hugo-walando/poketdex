import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Navbar from './components/layout/NavBar';
import MaxWidthWrapper from './components/layout/MaxWidthWrapper';
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
  title: 'PokeXchange',
  description: 'Echangez vos cartes Pokémon TCG Pocket !',
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='fr' className={poppins.variable}>
      <body>
        <MaxWidthWrapper>
          <SessionProvider>
            <Navbar />
            {children}
          </SessionProvider>
        </MaxWidthWrapper>
      </body>
    </html>
  );
}
