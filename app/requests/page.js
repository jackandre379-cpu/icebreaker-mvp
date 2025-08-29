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

export default function RequestsPage() {
  const [incoming, setIncoming] = useState([]);
  const [share, setShare] = useState({ ig: true, phone: false, linkedin: false });

  // Subscribe to my pending incoming requests and attach sender profile
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

  // Accept / decline request
  const act = async (req, decision) => {
    if (decision === 'declined') {
      await updateDoc(doc(db, 'requests', req.id), {
        status: 'declined',
        respondedAt: serverTimestamp()
      });
      return;
    }

    // decision === 'accepted' → exchange values
    const fromProfileSnap = await getDoc(doc(db, 'profiles', req.fromUid)); // requester
    const toProfileSnap = await getDoc(doc(db, 'profiles', req.toUid));     // me (receiver)
    const fromProfile = fromProfileSnap.exists() ? fromProfileSnap.data() : {};
    const toProfile = toProfileSnap.exists() ? toProfileSnap.data() : {};

    const pickSharedValues = (selected, profile) => {
      const out = {};
      if (selected?.ig && profile.ig) out.ig = profile.ig;
      if (selected?.phone && profile.phone) out.phone = profile.phone;
      if (selected?.linkedin && profile.linkedin) out.linkedin = profile.linkedin;
      return out;
    };

    const fieldsAtoB = pickSharedValues(req.fieldsFrom, fromProfile); // requester → me
    const fieldsBtoA = pickSharedValues(share, toProfile);            // me → requester

    if (!Object.keys(fieldsAtoB).length && !Object.keys(fieldsBtoA).length) {
      alert('No contact details selected or available to share.');
      return;
    }

    await addDoc(collection(db, 'connections'), {
      aUid: req.fromUid,
      bUid: req.toUid,
      venueBucket: req.venueBucket,
      fieldsAtoB, // now contain real values, e.g., { ig: "handle" }
      fieldsBtoA,
      createdAt: serverTimestamp()
    });

    await updateDoc(doc(db, 'requests', req.id), {
      status: 'accepted',
      respondedAt: serverTimestamp()
    });

    alert('Contact exchanged! Scroll down to Connections.');
  };

  return (
    <div style={{ display: 'grid', gap: 14, maxWidth: 820, marginInline: 'auto' }}>
      <h2>Requests</h2>

      {/* Default share toggles */}
      <div style={{ border: '1px solid #eee', padding: 16, borderRadius: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Default share for accepts</div>
        <label style={{ display: 'block' }}>
          <input
            type="checkbox"
            checked={share.ig}
            onChange={(e) => setShare((s) => ({ ...s, ig: e.target.checked }))}
          />{' '}
          Instagram
        </label>
        <label style={{ display: 'block' }}>
          <input
            type="checkbox"
            checked={share.phone}
            onChange={(e) => setShare((s) => ({ ...s, phone: e.target.checked }))}
          />{' '}
          Phone
        </label>
        <label style={{ display: 'block' }}>
          <input
            type="checkbox"
            checked={share.linkedin}
            onChange={(e) => setShare((s) => ({ ...s, linkedin: e.target.checked }))}
          />{' '}
          LinkedIn
        </label>
      </div>

      {/* Incoming requests with sender avatar */}
      {incoming.map((req) => (
        <div key={req.id} style={{ border: '1px solid #eee', borderRadius: 16, padding: 12 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '56px 1fr',
              gap: 12,
              alignItems: 'center'
            }}
          >
            <Avatar
              photoURL={req.fromProfile.photoURL}
              firstName={req.fromProfile.firstName || 'Someone'}
              size={56}
            />

            <div style={{ display: 'grid', gap: 6 }}>
              <div>
                <b>{req.fromProfile.firstName || 'Someone'}</b> wants to connect
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>
                They offered to share:{' '}
                {Object.entries(req.fieldsFrom || {})
                  .filter(([_, v]) => v)
                  .map(([k]) => k)
                  .join(', ') || 'nothing'}
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button onClick={() => act(req, 'declined')}>Not now</button>
                <button
                  onClick={() => act(req, 'accepted')}
                  style={{ background: 'black', color: 'white', borderRadius: 8, padding: '6px 10px' }}
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      {incoming.length === 0 && <div>No pending requests.</div>}

      <hr />
      <Connections />
    </div>
  );
}

/* ---------------- Connections list ---------------- */

function Connections() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const user = await ensureAnonAuth();

      const unsubA = onSnapshot(
        query(collection(db, 'connections'), where('aUid', '==', user.uid)),
        (snap) => {
          setItems((prev) =>
            uniqBy([...prev, ...snap.docs.map((d) => ({ id: d.id, ...d.data() }))], 'id')
          );
        }
      );
      const unsubB = onSnapshot(
        query(collection(db, 'connections'), where('bUid', '==', user.uid)),
        (snap) => {
          setItems((prev) =>
            uniqBy([...prev, ...snap.docs.map((d) => ({ id: d.id, ...d.data() }))], 'id')
          );
        }
      );

      return () => {
        unsubA();
        unsubB();
      };
    })().catch(console.error);
  }, []);

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <h3>Connections</h3>
      {items.map((c) => (
        <div key={c.id} style={{ border: '1px dashed #ccc', padding: 10, borderRadius: 12 }}>
          <div style={{ fontSize: 12, color: '#666' }}>Venue: {c.venueBucket}</div>
          <div>
            <b>What they shared with you:</b> <FieldsDisplay obj={c.fieldsAtoB} />
          </div>
          <div>
            <b>What you shared with them:</b> <FieldsDisplay obj={c.fieldsBtoA} />
          </div>
        </div>
      ))}
      {items.length === 0 && <div>No connections yet.</div>}
    </div>
  );
}

/* ---------------- Small helpers ---------------- */

function FieldsDisplay({ obj }) {
  // tolerant to legacy boolean data
  const parts = [];

  if (obj && obj.ig) {
    if (typeof obj.ig === 'string' && obj.ig.trim()) {
      const handle = obj.ig.replace(/^@/, '').trim();
      parts.push(
        <div key="ig">
          Instagram:{' '}
          <a href={`https://instagram.com/${handle}`} target="_blank" rel="noreferrer">
            @{handle}
          </a>
        </div>
      );
    } else if (obj.ig === true) {
      parts.push(<div key="ig-legacy">Instagram: (shared)</div>);
    }
  }

  if (obj && obj.phone) {
    if (typeof obj.phone === 'string' && obj.phone.trim()) {
      parts.push(<div key="phone">Phone: {obj.phone}</div>);
    } else if (obj.phone === true) {
      parts.push(<div key="phone-legacy">Phone: (shared)</div>);
    }
  }

  if (obj && obj.linkedin) {
    if (typeof obj.linkedin === 'string' && obj.linkedin.trim()) {
      parts.push(
        <div key="li">
          LinkedIn:{' '}
          <a href={obj.linkedin} target="_blank" rel="noreferrer">
            {obj.linkedin}
          </a>
        </div>
      );
    } else if (obj.linkedin === true) {
      parts.push(<div key="li-legacy">LinkedIn: (shared)</div>);
    }
  }

  return parts.length ? <div style={{ display: 'grid', gap: 2 }}>{parts}</div> : <span>—</span>;
}

function Avatar({ photoURL, firstName, size = 48 }) {
  const initials = (firstName?.trim()?.[0] || '?').toUpperCase();
  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={firstName || 'Profile'}
        width={size}
        height={size}
        style={{ borderRadius: '50%', objectFit: 'cover', display: 'block' }}
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
      aria-label="No profile photo"
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
