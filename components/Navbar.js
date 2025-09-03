'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db, ensureAnonAuth } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function Navbar() {
  const [count, setCount] = useState(0);

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
    <nav style={{ display: 'flex', gap: 12 }}>
      <Link href="/checkin">Check in</Link>
      <Link href="/nearby">Nearby</Link>
      <Link href="/requests">
        Requests {count > 0 && <span style={{ color: 'red' }}>({count})</span>}
      </Link>
      <Link href="/profile">Profile</Link>
    </nav>
  );
}
