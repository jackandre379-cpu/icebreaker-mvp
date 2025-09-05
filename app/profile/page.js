'use client';

import { useEffect, useState } from 'react';
import { db, ensureAnonAuth, storage } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ProfilePage() {
  const [firstName, setFirstName] = useState('');
  const [bio, setBio] = useState('');
  const [ig, setIg] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [status, setStatus] = useState('');

  // Load profile
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

  // Save
  const save = async () => {
    const user = await ensureAnonAuth();
    await setDoc(
      doc(db, 'profiles', user.uid),
      { firstName, bio, ig, phone, linkedin, photoURL },
      { merge: true }
    );
    setStatus('✅ Profile saved!');
    setTimeout(() => setStatus(''), 2500);
  };

  // Upload
  const uploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image is larger than 5MB. Please choose a smaller one.');
      return;
    }

    setStatus('📤 Uploading...');
    try {
      const user = await ensureAnonAuth();
      const key = `userPhotos/${user.uid}/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, key);

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      setPhotoURL(url);
      await setDoc(doc(db, 'profiles', user.uid), { photoURL: url }, { merge: true });
      setStatus('✅ Photo updated!');
    } catch (err) {
      console.error('❌ Upload failed:', err);
      alert(`Upload failed: ${err?.code || ''} ${err?.message || err}`);
    } finally {
      setTimeout(() => setStatus(''), 2500);
    }
  };

  return (
    <>
      <div className="page-header">My Profile</div>

      <div className="page">
        <div className="card">
          {/* ✅ Unified Avatar */}
          <Avatar photoURL={photoURL} firstName={firstName} size="lg" />

          {/* Name + Bio preview */}
          <h2 style={{ marginTop: "12px", marginBottom: "4px" }}>
            {firstName || "Name"}
          </h2>
          {bio && <p style={{ marginBottom: "20px" }}>{bio}</p>}

          {/* Upload photo button */}
          <div className="form-group" style={{ textAlign: "center" }}>
            <label className="upload-btn">
              Upload new photo
              <input type="file" accept="image/*" onChange={uploadPhoto} hidden />
            </label>
          </div>

          {/* Form fields */}
          <div className="form-group">
            <label>Name</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Instagram</label>
            <input value={ig} onChange={(e) => setIg(e.target.value)} placeholder="@username" />
          </div>

          <div className="form-group">
            <label>LinkedIn</label>
            <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/username" />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+123456789" />
          </div>

          <button className="btn" onClick={save}>Save Profile</button>
          {status && <div className="status">{status}</div>}

          {/* ✅ Privacy footer inside card */}
          <div className="privacy-bar">
            <a href="/privacy-policy">
              Privacy-first: session-based presence, no exact GPS stored.
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

/* ✅ Unified Avatar */
function Avatar({ photoURL, firstName, size = "sm" }) {
  const initials = (firstName?.trim()?.[0] || '?').toUpperCase();
  return (
    <div
      className={`avatar ${size}`}
      style={photoURL ? { backgroundImage: `url(${photoURL})` } : {}}
    >
      {!photoURL && initials}
    </div>
  );
}
