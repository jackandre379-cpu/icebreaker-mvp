import './globals.css';
import Navbar from '../components/Navbar';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'Icebreaker MVP',
  description: 'Discreet, mutual contact exchange',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <header>
          <a href="/">Icebreaker</a>
          <Navbar />
        </header>

        <main>{children}</main>

        <footer>
          Privacy-first: session-based presence, no exact GPS stored.
        </footer>
      </body>
    </html>
  );
}
