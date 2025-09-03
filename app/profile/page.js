'use client';

import { useEffect, useState } from 'react';
import { db, ensureAnonAuth, storage } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Lucide icons
import { User, FileText, Instagram, Phone, Linkedin } from "lucide-react";

const ICONS = {
  name: <User size={16} strokeWidth={1.8} />,
  bio: <FileText size={16} strokeWidth={1.8} />,
  ig: <Instagram size={16} strokeWidth={1.8} />,
  phone: <Phone size={16} strokeWidth={1.8} />,
  linkedin: <Linkedin size={16} strokeWidth={1.8} />,
};

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
    <div className="page">
      <div className="card profile-card">
        <h2 className="profile-title">My Profile</h2>

        {/* Avatar upload */}
        <div className="avatar-row">
          <AvatarPreview photoURL={photoURL} firstName={firstName} size={84} />
          <div className="upload-box">
            <label className="upload-btn">
              Upload new photo
              <input type="file" accept="image/*" onChange={uploadPhoto} hidden />
            </label>
            <span className="upload-hint">JPG/PNG, &lt; 5MB</span>
          </div>
        </div>

        {/* Form */}
        <div className="profile-form">
          <div className="profile-form-row">
            <label className="profile-label">First name</label>
            <div className="input-wrapper">
              <span className="icon">{ICONS.name}</span>
              <input
                className="profile-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
          </div>

          <div className="profile-form-row">
            <label className="profile-label">Short bio</label>
            <div className="input-wrapper">
              <span className="icon">{ICONS.bio}</span>
              <textarea
                className="profile-textarea"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell people a little about you..."
              />
            </div>
          </div>

          <div className="profile-form-row">
            <label className="profile-label">Instagram</label>
            <div className="input-wrapper">
              <span className="icon">{ICONS.ig}</span>
              <input
                className="profile-input"
                value={ig}
                onChange={(e) => setIg(e.target.value)}
                placeholder="@yourhandle"
              />
            </div>
          </div>

          <div className="profile-form-row">
            <label className="profile-label">Phone</label>
            <div className="input-wrapper">
              <span className="icon">{ICONS.phone}</span>
              <input
                className="profile-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+212..."
              />
            </div>
          </div>

          <div className="profile-form-row">
            <label className="profile-label">LinkedIn</label>
            <div className="input-wrapper">
              <span className="icon">{ICONS.linkedin}</span>
              <input
                className="profile-input"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>
        </div>

<div className="profile-actions">
  <button className="btn primary" onClick={save}>Save changes</button>
</div>
        {status && <div className="status">{status}</div>}
      </div>
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
        className="avatar"
      />
    );
  }
  return (
    <div
      className="avatar placeholder"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
}
