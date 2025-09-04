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

        const EXPIRY_MINUTES = 10;
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

        const q = query(collection(db, 'sessions'));
        const unsub = onSnapshot(q, async snap => {
          const now = Timestamp.now();
          const uids = [];

          snap.forEach(d => {
            const data = d.data();
            if (
              data.venueBucket === vb &&
              d.id !== user.uid &&
              data.expiresAt?.toMillis() > now.toMillis()
            ) {
              uids.push(d.id);
            }
          });

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
      }, 2500);
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
    <>
      <div className="page-header">Nearby People</div>

      <div className="page">
        <div className="list">
          {!bucket && <div className="empty">Detecting your venue…</div>}

          {profiles.map((p, i) => (
            <ProfileCard
              key={p.uid}
              profile={p}
              onConnect={() => setOpenShareForUid(p.uid)}
            />
          ))}

          {profiles.length === 0 && bucket && (
            <div className="empty">No one here yet. Ask a friend to open the app.</div>
          )}
        </div>

        {toast && <div className="toast">{toast}</div>}
      </div>

      <ShareModal
        open={!!openShareForUid}
        onClose={() => setOpenShareForUid(null)}
        onSend={(fields) => sendRequest(openShareForUid, fields)}
      />
    </>
  );
}
