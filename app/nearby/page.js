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
  setDoc,
  serverTimestamp,
  addDoc,
  Timestamp
} from 'firebase/firestore';
import ProfileCard from '../../components/ProfileCard';
import ShareModal from '../../components/ShareModal';

export default function NearbyPage() {
  const [bucket, setBucket] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [selfUid, setSelfUid] = useState(null);
  const [openShareForUid, setOpenShareForUid] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    (async () => {
      const user = await ensureAnonAuth();
      setSelfUid(user.uid);
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(async pos => {
        const vb = venueBucketFromLatLng(pos.coords.latitude, pos.coords.longitude, 3);
        setBucket(vb);

        // set expiry (10 minutes from now)
        const EXPIRY_MINUTES = 10;
        const expiresAt = Timestamp.fromDate(
          new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000)
        );

        // create/update own session
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

        // subscribe to all sessions in the same bucket
        const q = query(collection(db, 'sessions'));
        const unsub = onSnapshot(q, async snap => {
          const now = Timestamp.now();
          const uids = [];

          snap.forEach(d => {
            const data = d.data();
            // same bucket, not self, and not expired
            if (
              data.venueBucket === vb &&
              d.id !== user.uid &&
              data.expiresAt?.toMillis() > now.toMillis()
            ) {
              uids.push(d.id);
            }
          });

          // fetch profiles
          const results = [];
          for (const uid of uids) {
            const p = await getDoc(doc(db, 'profiles', uid));
            results.push({ uid, ...(p.exists() ? p.data() : {}) });
          }
          setProfiles(results);
        });

        return () => unsub();
      });
    })().catch(console.error);
  }, []);

  const sendRequest = async (targetUid, fields) => {
    const user = await ensureAnonAuth();
    const selfProfile = await getDoc(doc(db, 'profiles', user.uid));
    const data = selfProfile.data() || {};

    const hasShareable =
      data.ig?.trim() || data.phone?.trim() || data.linkedin?.trim();

    if (!hasShareable) {
      setToast("⚠️ Please add at least one contact method (IG, phone, or LinkedIn) before sending requests.");
      setTimeout(() => {
        window.location.href = "/profile";
      }, 2500); // wait 5s before redirect
      return;
    }

    await addDoc(collection(db, 'requests'), {
      fromUid: user.uid,
      toUid: targetUid,
      venueBucket: bucket,
      status: 'pending',
      fieldsFrom: fields,
      createdAt: serverTimestamp()
    });
    setOpenShareForUid(null);
    setToast('✅ Request sent! They will choose what to share back.');
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h2>People nearby</h2>
      {!bucket && <div>Detecting your venue…</div>}
      <div style={{ display: 'grid', gap: 12 }}>
        {profiles.map(p => (
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
        onSend={fields => sendRequest(openShareForUid, fields)}
      />

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
