import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Navbar from './components/layout/NavBar';
import MaxWidthWrapper from './components/layout/MaxWidthWrapper';

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
    <html lang='en' className={poppins.className}>
      <body>
        <MaxWidthWrapper>
          <Navbar />
          {children}
        </MaxWidthWrapper>
      </body>
    </html>
  );
}
