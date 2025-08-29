'use client';

import { useEffect, useState } from 'react';
import { db, ensureAnonAuth } from '../../lib/firebase';
import { venueBucketFromLatLng } from '../../lib/venue';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function CheckInPage() {
  const [bucket, setBucket] = useState(null);
  const [status, setStatus] = useState('');

  const checkIn = async () => {
    setStatus('Requesting location...');
    if (!navigator.geolocation) {
      setStatus('Geolocation not supported.');
      return;
    }
    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude, longitude } = pos.coords;
      const vb = venueBucketFromLatLng(latitude, longitude, 3);
      setBucket(vb);
      setStatus('Signing in...');
      const user = await ensureAnonAuth();
      await setDoc(doc(db, 'sessions', user.uid), {
        uid: user.uid,
        venueBucket: vb,
        updatedAt: serverTimestamp()
      });
      setStatus('Checked in! You are visible to others in this place.');
    }, err => {
      setStatus('Permission denied or error getting location.');
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 });
  };

  useEffect(() => {
    // auto-run once
    checkIn().catch(console.error);
  }, []);

  return (
    <div style={{ display:'grid', gap: 12 }}>
      <h2>Check in</h2>
      <p>We store only a coarse venue bucket, not your exact location.</p>
      <button onClick={checkIn} style={{ background:'black', color:'white', borderRadius:8, padding:'8px 12px', width:'fit-content' }}>
        Re-check in
      </button>
      <div><b>Status:</b> {status}</div>
      {bucket && <div><b>Venue bucket:</b> {bucket}</div>}
    </div>
  );
}
