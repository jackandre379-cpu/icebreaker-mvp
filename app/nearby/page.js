'use client';

import { useEffect, useState } from 'react';
import { db, ensureAnonAuth } from '../../lib/firebase';
import { venueBucketFromLatLng } from '../../lib/venue';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  setDoc,
  serverTimestamp,
  addDoc,
} from 'firebase/firestore';

import ProfileCard from '../../components/ProfileCard';
import ShareModal from '../../components/ShareModal';

export default function NearbyPage() {
  const [bucket, setBucket] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [selfUid, setSelfUid] = useState(null);
  const [openShareForUid, setOpenShareForUid] = useState(null);

  // how long a session should last (must match CheckInPage EXPIRY_MINUTES)
  const EXPIRY_MINUTES = 10;

  useEffect(() => {
    (async () => {
      const user = await ensureAnonAuth();
      setSelfUid(user.uid);

      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const vb = venueBucketFromLatLng(pos.coords.latitude, pos.coords.longitude, 3);
        setBucket(vb);

        // ensure own session exists with expiry
        const now = Date.now();
        const expiresAt = new Date(now + EXPIRY_MINUTES * 60 * 1000);

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

        // 🔎 Subscribe to active sessions in same bucket (not expired)
        const qSessions = query(
          collection(db, 'sessions'),
          where('venueBucket', '==', vb),
          where('expiresAt', '>', new Date()) // filter only active
        );

        const unsub = onSnapshot(qSessions, async (snap) => {
          const uids = [];
          snap.forEach((d) => {
            if (d.id !== user.uid) {
              uids.push(d.id);
            }
          });

          // fetch profiles for those active UIDs
          const results = [];
          for (const uid of uids) {
            const p = await getDoc(doc(db, 'profiles', uid));
            if (p.exists()) {
              results.push({ uid, ...p.data() });
            }
          }
          setProfiles(results);
        });

        return () => unsub();
      });
    })().catch(console.error);
  }, []);

  const sendRequest = async (targetUid, fields) => {
    const user = await ensureAnonAuth();
    await addDoc(collection(db, 'requests'), {
      fromUid: user.uid,
      toUid: targetUid,
      venueBucket: bucket,
      status: 'pending',
      fieldsFrom: fields, // { ig: true/false, phone: true/false, linkedin: true/false }
      createdAt: serverTimestamp(),
    });
    setOpenShareForUid(null);
    alert('Request sent! They will choose what to share back.');
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h2>People nearby</h2>
      {!bucket && <div>Detecting your venue…</div>}
      <div style={{ display: 'grid', gap: 12 }}>
        {profiles.map((p) => (
          <ProfileCard
            key={p.uid}
            profile={p}
            onConnect={() => setOpenShareForUid(p.uid)}
          />
        ))}
        {profiles.length === 0 && bucket && (
          <div>No one here yet. Ask a friend to open the app.</div>
        )}
      </div>
      <ShareModal
        open={!!openShareForUid}
        onClose={() => setOpenShareForUid(null)}
        onSend={(fields) => sendRequest(openShareForUid, fields)}
      />
    </div>
  );
}
