import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Navbar from './components/layout/NavBar';

export const metadata: Metadata = {
  title: 'PokeXchange',
  description: 'Echangez vos cartes Pokémon TCG Pocket !',
};

const poppins = Poppins({
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={poppins.className}>
      <body>
        {/* <Navbar /> */}
        {children}
      </body>
    </html>
  );
}
