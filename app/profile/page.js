'use client';

import { useEffect, useState } from 'react';
import { db, ensureAnonAuth } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ProfilePage() {
  const [firstName, setFirstName] = useState('');
  const [bio, setBio] = useState('');
  const [ig, setIg] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [status, setStatus] = useState('');

  // Load existing profile
  useEffect(() => {
    (async () => {
      const user = await ensureAnonAuth();
      const snap = await getDoc(doc(db, 'profiles', user.uid));
      if (snap.exists()) {
        const d = snap.data();
        setFirstName(d.firstName || '');
        setBio(d.bio || '');
        setIg(d.ig || '');
        setPhone(d.phone || '');
        setLinkedin(d.linkedin || '');
        setPhotoURL(d.photoURL || '');
      }
    })().catch(console.error);
  }, []);

  const save = async () => {
    const user = await ensureAnonAuth();
    await setDoc(
      doc(db, 'profiles', user.uid),
      { firstName, bio, ig, phone, linkedin, photoURL },
      { merge: true }
    );
    setStatus('Saved!');
    setTimeout(() => setStatus(''), 2000);
  };

  const uploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // (Optional) basic client-side guard
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image is larger than 5MB. Please choose a smaller one.');
      return;
    }

    setStatus('Uploading photo…');
    try {
      const user = await ensureAnonAuth();
      const key = `userPhotos/${user.uid}/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, key);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      setPhotoURL(url); // show immediately
      await setDoc(doc(db, 'profiles', user.uid), { photoURL: url }, { merge: true });
      setStatus('Photo updated!');
   } catch (err) {
  console.error('Upload failed:', err);
  alert(`Upload failed: ${err?.code || ''} ${err?.message || err}`);
  setStatus('');
}
 finally {
      setTimeout(() => setStatus(''), 2000);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 10, maxWidth: 520 }}>
      <h2>My Profile</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <AvatarPreview photoURL={photoURL} firstName={firstName} size={84} />
        <label style={{ fontSize: 14 }}>
          <div style={{ marginBottom: 6, fontWeight: 600 }}>Profile photo</div>
          <input type="file" accept="image/*" onChange={uploadPhoto} />
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
            JPG/PNG, &lt; 5 MB
          </div>
        </label>
      </div>

      <label>
        First name
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </label>

      <label>
        Short bio
        <input value={bio} onChange={(e) => setBio(e.target.value)} />
      </label>

      <label>
        Instagram
        <input value={ig} onChange={(e) => setIg(e.target.value)} placeholder="@yourhandle" />
      </label>

      <label>
        Phone
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+212..." />
      </label>

      <label>
        LinkedIn
        <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." />
      </label>

      <button
        onClick={save}
        style={{ background: 'black', color: 'white', padding: '8px 14px', borderRadius: 10, width: 'fit-content' }}
      >
        Save
      </button>

      {status && <div style={{ color: 'green' }}>{status}</div>}
    </div>
  );
}

function AvatarPreview({ photoURL, firstName, size = 60 }) {
  const initials = (firstName?.trim()?.[0] || '?').toUpperCase();
  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt="Profile"
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
