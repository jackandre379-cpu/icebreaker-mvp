import LayoutClient from '../components/LayoutClient';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: ' aldingo',
  description: 'Discreet, mutual contact exchange',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
