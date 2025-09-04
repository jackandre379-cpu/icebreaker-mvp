import './globals.css';
import Navbar from '../components/Navbar';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'Icebreaker MVP',
  description: 'Discreet, mutual contact exchange',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <main>{children}</main>

        {/* ✅ Privacy bar is its own element */}
        <div className="privacy-bar">
          <Link href="/privacy">
            Privacy-first: session-based presence, no exact GPS stored.
          </Link>
        </div>

        {/* ✅ Bottom nav (Navbar component renders <nav className="bottom-nav">) */}
        <Navbar />
      </body>
    </html>
  );
}
