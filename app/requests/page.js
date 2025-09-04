'use client';

import { useEffect, useState } from 'react';
import { db, ensureAnonAuth } from '../../lib/firebase';
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  serverTimestamp,
  addDoc,
  getDoc
} from 'firebase/firestore';

/* ---------------- Main Page ---------------- */

export default function RequestsPage() {
  const [incoming, setIncoming] = useState([]);
  const [connections, setConnections] = useState([]);

  // Subscribe to incoming requests
  useEffect(() => {
    (async () => {
      const user = await ensureAnonAuth();
      const q = query(
        collection(db, 'requests'),
        where('toUid', '==', user.uid),
        where('status', '==', 'pending')
      );
      const unsub = onSnapshot(q, async (snap) => {
        const items = [];
        for (const d of snap.docs) {
          const req = d.data();
          const fromProfileSnap = await getDoc(doc(db, 'profiles', req.fromUid));
          const fromProfile = fromProfileSnap.exists()
            ? fromProfileSnap.data()
            : { firstName: 'Someone' };
          items.push({ id: d.id, ...req, fromProfile });
        }
        setIncoming(items);
      });
      return () => unsub();
    })().catch(console.error);
  }, []);

  // Subscribe to connections
  useEffect(() => {
    (async () => {
      const user = await ensureAnonAuth();

      const handleSnap = async (snap, key) => {
        const items = [];
        for (const d of snap.docs) {
          const data = d.data();
          const otherUid = key === 'aUid' ? data.bUid : data.aUid;
          const profileSnap = await getDoc(doc(db, 'profiles', otherUid));
          const profile = profileSnap.exists()
            ? profileSnap.data()
            : { firstName: 'Someone' };
          items.push({ id: d.id, ...data, otherProfile: profile });
        }
        setConnections((prev) => uniqBy([...prev, ...items], 'id'));
      };

      const unsubA = onSnapshot(
        query(collection(db, 'connections'), where('aUid', '==', user.uid)),
        (snap) => handleSnap(snap, 'aUid')
      );
      const unsubB = onSnapshot(
        query(collection(db, 'connections'), where('bUid', '==', user.uid)),
        (snap) => handleSnap(snap, 'bUid')
      );

      return () => {
        unsubA();
        unsubB();
      };
    })().catch(console.error);
  }, []);

  // Accept / decline request
  const act = async (req, decision) => {
    if (decision === 'declined') {
      await updateDoc(doc(db, 'requests', req.id), {
        status: 'declined',
        respondedAt: serverTimestamp()
      });
      return;
    }

    // accepted → create connection
    await addDoc(collection(db, 'connections'), {
      aUid: req.fromUid,
      bUid: req.toUid,
      venueBucket: req.venueBucket,
      fieldsAtoB: req.fieldsFrom,
      createdAt: serverTimestamp()
    });

    await updateDoc(doc(db, 'requests', req.id), {
      status: 'accepted',
      respondedAt: serverTimestamp()
    });
  };

  return (
    <>
      <div className="page-header">Connections & Requests</div>
      <div className="requests-page">

        {/* Requests */}
        <section>
          <h2>Connection Requests</h2>
          <div className="requests-grid">
            {incoming.map((req) => (
              <div key={req.id} className="requests-card">
                <Avatar
                  photoURL={req.fromProfile.photoURL}
                  firstName={req.fromProfile.firstName}
                  size={64}
                />
                <div className="requests-info">
                  <h3>{req.fromProfile.firstName || 'Someone'}</h3>
                  <p>{req.fromProfile.bio || ''}</p>
                </div>
                <div className="requests-actions">
                  <button
                    className="btn accept"
                    onClick={() => act(req, 'accepted')}
                  >
                    Accept
                  </button>
                  <button
                    className="btn decline"
                    onClick={() => act(req, 'declined')}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
            {incoming.length === 0 && (
              <div className="empty">No pending requests.</div>
            )}
          </div>
        </section>

        {/* Connections */}
        <section>
          <h2>Connected People</h2>
          <div className="requests-grid">
            {connections.map((c) => (
              <div key={c.id} className="requests-card">
                <Avatar
                  photoURL={c.otherProfile.photoURL}
                  firstName={c.otherProfile.firstName}
                  size={64}
                />
                <div className="requests-info">
                  <h3>{c.otherProfile.firstName || 'Someone'}</h3>
                  <FieldsDisplay obj={c.fieldsAtoB} />
                </div>
              </div>
            ))}
            {connections.length === 0 && (
              <div className="empty">No connections yet.</div>
            )}
          </div>
        </section>

      </div>
    </>
  );
}

/* ---------------- Helpers ---------------- */

function FieldsDisplay({ obj }) {
  const pills = [];

  if (obj?.ig) {
    const handle = String(obj.ig).replace(/^@/, '').trim();
    pills.push(
      <a
        key="ig"
        href={`https://instagram.com/${handle}`}
        target="_blank"
        rel="noreferrer"
        className="pill"
      >
        📸 @{handle}
      </a>
    );
  }

  if (obj?.phone) {
    pills.push(
      <span key="phone" className="pill">
        📱 {obj.phone}
      </span>
    );
  }

  if (obj?.linkedin) {
    pills.push(
      <a
        key="li"
        href={obj.linkedin}
        target="_blank"
        rel="noreferrer"
        className="pill"
      >
        🔗 LinkedIn
      </a>
    );
  }

  return pills.length ? <div className="pills">{pills}</div> : null;
}

function Avatar({ photoURL, firstName, size = 64 }) {
  const initials = (firstName?.trim()?.[0] || '?').toUpperCase();
  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={firstName || 'Profile'}
        width={size}
        height={size}
        style={{
          borderRadius: '50%',
          objectFit: 'cover',
          display: 'block'
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#eee',
        display: 'grid',
        placeItems: 'center',
        fontWeight: 700
      }}
    >
      {initials}
    </div>
  );
}

function uniqBy(arr, key) {
  const map = new Map();
  for (const item of arr) map.set(item[key], item);
  return Array.from(map.values());
}
