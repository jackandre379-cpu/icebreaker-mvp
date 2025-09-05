'use client';

import Navbar from './Navbar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LayoutClient({ children }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const showNav = !isHome;
  const showPrivacyBar = !isHome; // ✅ only show on non-home pages

  return (
    <>
      <main>{children}</main>

      {/* Privacy bar only on other pages */}
      {showPrivacyBar && (
        <div className="privacy-bar">
          <Link href="/privacy">
            Privacy-first: session-based presence, no exact GPS stored.
          </Link>
        </div>
      )}

      {/* Bottom nav only on other pages */}
      {showNav && <Navbar />}
    </>
  );
}
