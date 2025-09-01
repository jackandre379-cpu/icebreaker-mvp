'use client';

import { useEffect, useState } from 'react';
import { db, ensureAnonAuth } from '../../lib/firebase';
import { venueBucketFromLatLng } from '../../lib/venue';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

export default function CheckInPage() {
  const [bucket, setBucket] = useState(null);
  const [status, setStatus] = useState('');
  const [toast, setToast] = useState(null);

  // ⏰ How long a check-in should last (must match NearbyPage)
  const EXPIRY_MINUTES = 10;

  const checkIn = async () => {
    setStatus('Requesting location...');
    if (!navigator.geolocation) {
      setStatus('❌ Geolocation not supported.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const vb = venueBucketFromLatLng(latitude, longitude, 3);
        setBucket(vb);

        setStatus('Signing in...');
        const user = await ensureAnonAuth();

        // 🔑 Check profile before allowing session
        const profileSnap = await getDoc(doc(db, 'profiles', user.uid));
        if (!profileSnap.exists() || !profileSnap.data().firstName?.trim()) {
          setToast('⚠️ Please add your name before checking in.');
          setStatus('Profile incomplete');
          setTimeout(() => {
            window.location.href = '/profile';
          }, 5000); // wait 5 seconds before redirect
          return;
        }

        // Optional recommendation if photo missing
        if (!profileSnap.data().photoURL) {
          setToast('💡 Tip: Add a photo so people can recognize you more easily.');
        }

        // set expiry 10 min into the future
        const expiresAt = Timestamp.fromDate(
          new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000)
        );

        await setDoc(
          doc(db, 'sessions', user.uid),
          {
            uid: user.uid,
            venueBucket: vb,
            updatedAt: serverTimestamp(),
            expiresAt,
          },
          { merge: true }
        );

        setStatus(
          `✅ Checked in! You are visible in ${vb} for ${EXPIRY_MINUTES} minutes.`
        );
      },
      (err) => {
        setStatus('❌ Permission denied or error getting location.');
        console.error(err);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    // auto-run once on mount
    checkIn().catch(console.error);

    // expire immediately when leaving
    const cleanup = async () => {
      try {
        const user = await ensureAnonAuth();
        await setDoc(
          doc(db, 'sessions', user.uid),
          { expiresAt: Timestamp.fromDate(new Date()) }, // ✅ expire immediately
          { merge: true }
        );
      } catch (e) {
        console.error('Failed to clear session on unload:', e);
      }
    };
    window.addEventListener('beforeunload', cleanup);
    return () => window.removeEventListener('beforeunload', cleanup);
  }, []);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h2>Check in</h2>
      <p>We store only a coarse venue bucket, not your exact location.</p>
      <button
        onClick={checkIn}
        style={{
          background: 'black',
          color: 'white',
          borderRadius: 8,
          padding: '8px 12px',
          width: 'fit-content',
        }}
      >
        Re-check in
      </button>
      <div>
        <b>Status:</b> {status}
      </div>
      {bucket && (
        <div>
          <b>Venue bucket:</b> {bucket}
        </div>
      )}

      {/* 🔔 Toast notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#333',
            color: 'white',
            padding: '10px 16px',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 1000,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
