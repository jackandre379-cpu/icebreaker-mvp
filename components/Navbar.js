'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db, ensureAnonAuth } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [count, setCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      const user = await ensureAnonAuth();
      const q = query(
        collection(db, 'requests'),
        where('toUid', '==', user.uid),
        where('status', '==', 'pending')
      );
      const unsub = onSnapshot(q, (snap) => {
        setCount(snap.size);
      });
      return () => unsub();
    })().catch(console.error);
  }, []);

 return (
  <nav className="bottom-nav">
    <Link href="/profile" className={pathname === '/profile' ? 'active' : ''}>
      Profile
    </Link>
    <Link href="/checkin" className={pathname === '/checkin' ? 'active' : ''}>
      Check In
    </Link>
    <Link href="/nearby" className={pathname === '/nearby' ? 'active' : ''}>
      Nearby
    </Link>
    <Link href="/requests" className={pathname === '/requests' ? 'active' : ''}>
      Requests {count > 0 && <span style={{ color: 'red' }}>({count})</span>}
    </Link>
  </nav>
);

}
