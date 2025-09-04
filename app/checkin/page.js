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

        // 🔑 Profile check
        const profileSnap = await getDoc(doc(db, 'profiles', user.uid));
        if (!profileSnap.exists() || !profileSnap.data().firstName?.trim()) {
          setToast('⚠️ Please add your name before checking in.');
          setStatus('Profile incomplete');
          setTimeout(() => {
            window.location.href = '/profile';
          }, 5000);
          return;
        }

        if (!profileSnap.data().photoURL) {
          setToast('💡 Tip: Add a photo so people can recognize you more easily.');
        }

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

        setStatus(`✅ Checked in! You are visible in ${vb} for ${EXPIRY_MINUTES} minutes.`);
      },
      (err) => {
        setStatus('❌ Permission denied or error getting location.');
        console.error(err);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    checkIn().catch(console.error);

    const cleanup = async () => {
      try {
        const user = await ensureAnonAuth();
        await setDoc(
          doc(db, 'sessions', user.uid),
          { expiresAt: Timestamp.fromDate(new Date()) },
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
    <>
      {/* ✅ Page header */}
      <div className="page-header">Check In</div>

      <div className="page">
        <div className="card">
          <h2>Check in</h2>
          <p>We store only a coarse venue bucket, not your exact location.</p>

          <button onClick={checkIn} className="btn">
            Re-check in
          </button>

          <div className="status">
            <b>Status:</b> {status}
          </div>

          {bucket && (
            <div className="status">
              <b>Venue bucket:</b> {bucket}
            </div>
          )}
        </div>

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
