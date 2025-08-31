'use client';

import { useEffect, useMemo, useState } from 'react';
import { db, ensureAnonAuth } from '../../lib/firebase';
import { venueBucketFromLatLng } from '../../lib/venue';
import { collection, doc, getDoc, onSnapshot, query, setDoc, where, serverTimestamp, addDoc } from 'firebase/firestore';
import ProfileCard from '../../components/ProfileCard';
import ShareModal from '../../components/ShareModal';

export default function NearbyPage() {
  const [bucket, setBucket] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [selfUid, setSelfUid] = useState(null);
  const [openShareForUid, setOpenShareForUid] = useState(null);

  useEffect(() => {
    (async () => {
      const user = await ensureAnonAuth();
      setSelfUid(user.uid);
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(async pos => {
        const vb = venueBucketFromLatLng(pos.coords.latitude, pos.coords.longitude, 3);
        setBucket(vb);
        // (Optional) ensure session exists
        await setDoc(doc(db, 'sessions', user.uid), {
          uid: user.uid, venueBucket: vb, updatedAt: serverTimestamp()
        }, { merge: true });

        // subscribe to sessions in same bucket
        const q = query(collection(db, 'sessions'), where('venueBucket', '==', vb));
        const unsub = onSnapshot(q, async snap => {
          const uids = [];
          snap.forEach(d => { if (d.id !== user.uid) uids.push(d.id); });
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
    await addDoc(collection(db, 'requests'), {
      fromUid: user.uid,
      toUid: targetUid,
      venueBucket: bucket,
      status: 'pending',
      fieldsFrom: fields, // { ig: true/false, phone: true/false, linkedin: true/false }
      createdAt: serverTimestamp()
    });
    setOpenShareForUid(null);
    alert('Request sent! They will choose what to share back.');
  };

  return (
    <div style={{ display:'grid', gap: 12 }}>
      <h2>People nearby</h2>
      {!bucket && <div>Detecting your venue…</div>}
      <div style={{ display:'grid', gap: 12 }}>
        {profiles.map(p => (
          <ProfileCard key={p.uid} profile={p} onConnect={() => setOpenShareForUid(p.uid)} />
        ))}
        {profiles.length === 0 && bucket && <div>No one here yet. Ask a friend to open the app.</div>}
      </div>
      <ShareModal
        open={!!openShareForUid}
        onClose={() => setOpenShareForUid(null)}
        onSend={(fields) => sendRequest(openShareForUid, fields)}
      />
    </div>
  );
}
