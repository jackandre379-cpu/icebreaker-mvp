'use client';

import { useEffect, useState } from 'react';
import { db, ensureAnonAuth } from '../../lib/firebase';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  Timestamp,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import ProfileCard from '../../components/ProfileCard';
import ShareModal from '../../components/ShareModal';

export default function NearbyPage() {
  const [profiles, setProfiles] = useState([]);
  const [selfUid, setSelfUid] = useState(null);
  const [hasSession, setHasSession] = useState(false);
  const [openShareForUid, setOpenShareForUid] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    (async () => {
      const user = await ensureAnonAuth();
      setSelfUid(user.uid);

      // ✅ Check if the user has a valid session
      const sessionSnap = await getDoc(doc(db, 'sessions', user.uid));
      const now = Timestamp.now();
      if (sessionSnap.exists() && sessionSnap.data().expiresAt?.toMillis() > now.toMillis()) {
        setHasSession(true);
      } else {
        setHasSession(false);
        return; // don’t load others if not checked in
      }

      // ✅ Query only active sessions
      const q = query(
        collection(db, 'sessions'),
        where("expiresAt", ">", now)
      );

      const unsub = onSnapshot(q, async snap => {
        const results = [];
        for (const d of snap.docs) {
          const data = d.data();

          // Skip self
          if (d.id === user.uid) continue;

          // Load profile
          const pSnap = await getDoc(doc(db, 'profiles', d.id));
          if (pSnap.exists()) {
            const p = pSnap.data();

            // ✅ Only show complete profiles
            const hasProfile = p.firstName?.trim();
if (hasProfile) {
  results.push({ uid: d.id, ...p });
}
          }
        }
        setProfiles(results);
      });

      return () => unsub();
    })().catch(console.error);
  }, []);

  const sendRequest = async (targetUid, fields) => {
    const user = await ensureAnonAuth();
    const selfProfile = await getDoc(doc(db, 'profiles', user.uid));
    const data = selfProfile.data() || {};

    const hasShareable =
      data.ig?.trim() || data.phone?.trim() || data.linkedin?.trim();

    if (!hasShareable) {
      setToast(
        '⚠️ Please add at least one contact method (IG, phone, or LinkedIn) before sending requests.'
      );
      setTimeout(() => {
        window.location.href = '/profile';
      }, 2500);
      return;
    }

    await addDoc(collection(db, 'requests'), {
      fromUid: user.uid,
      toUid: targetUid,
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
          {!hasSession && (
            <div className="empty">
              You need to <a href="/checkin">check in</a> first to see who’s nearby.
            </div>
          )}

          {hasSession && profiles.map(p => (
            <ProfileCard
              key={p.uid}
              profile={p}
              onConnect={() => setOpenShareForUid(p.uid)}
            />
          ))}

          {hasSession && profiles.length === 0 && (
            <div className="empty">
              No one here yet. Ask a friend to check in.
            </div>
          )}

          {/* ✅ Privacy notice */}
          <div className="privacy-bar">
            <a href="/privacy-policy">
              Privacy-first: session-based presence, no exact GPS stored.
            </a>
          </div>
        </div>

        {toast && <div className="toast">{toast}</div>}
      </div>

      <ShareModal
        open={!!openShareForUid}
        onClose={() => setOpenShareForUid(null)}
        onSend={fields => sendRequest(openShareForUid, fields)}
      />
    </>
  );
}
