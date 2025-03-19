import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
