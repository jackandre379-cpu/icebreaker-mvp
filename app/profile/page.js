'use client';

import { useEffect, useState } from 'react';
import { db, ensureAnonAuth, storage, auth } from '../../lib/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { deleteUser } from "firebase/auth";
import { FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

const BIO_MAX = 150;

const COUNTRY_CODES = [
  { name: 'Morocco', dial: '+212', flag: '🇲🇦' },
  { name: 'Algeria', dial: '+213', flag: '🇩🇿' },
  { name: 'Tunisia', dial: '+216', flag: '🇹🇳' },
  { name: 'Egypt', dial: '+20', flag: '🇪🇬' },
  { name: 'Saudi Arabia', dial: '+966', flag: '🇸🇦' },
  { name: 'UAE', dial: '+971', flag: '🇦🇪' },
  { name: 'France', dial: '+33', flag: '🇫🇷' },
  { name: 'Spain', dial: '+34', flag: '🇪🇸' },
  { name: 'Belgium', dial: '+32', flag: '🇧🇪' },
  { name: 'Netherlands', dial: '+31', flag: '🇳🇱' },
  { name: 'Germany', dial: '+49', flag: '🇩🇪' },
  { name: 'Italy', dial: '+39', flag: '🇮🇹' },
  { name: 'UK', dial: '+44', flag: '🇬🇧' },
  { name: 'USA', dial: '+1', flag: '🇺🇸' },
  { name: 'Canada', dial: '+1 CA', flag: '🇨🇦' },
  { name: 'Turkey', dial: '+90', flag: '🇹🇷' },
  { name: 'Senegal', dial: '+221', flag: '🇸🇳' },
  { name: 'Ivory Coast', dial: '+225', flag: '🇨🇮' },
  { name: 'Other', dial: '+', flag: '🌍' },
];

function parsePhone(fullPhone) {
  if (!fullPhone) return { dial: '+212', number: '' };
  for (const c of COUNTRY_CODES) {
    if (c.dial !== '+' && fullPhone.startsWith(c.dial)) {
      return { dial: c.dial, number: fullPhone.slice(c.dial.length).trim() };
    }
  }
  return { dial: '+212', number: fullPhone };
}

export default function ProfilePage() {
  const [firstName, setFirstName] = useState('');
  const [bio, setBio] = useState('');
  const [ig, setIg] = useState('');
  const [countryDial, setCountryDial] = useState('+212');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [status, setStatus] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [verifyName, setVerifyName] = useState('');

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
        const parsed = parsePhone(d.phone || '');
        setCountryDial(parsed.dial);
        setPhoneNumber(parsed.number);
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
      { firstName, bio, ig, phone: phoneNumber ? `${countryDial}${phoneNumber}` : '', linkedin, photoURL },
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

  // ✅ Ask for permission before opening file picker
  const requestPhotoPermission = (e) => {
    e.preventDefault();
    e.stopPropagation(); // prevent auto file input trigger

    const ok = confirm(
      "Aldingo needs access to your camera or photo library so you can upload a profile photo."
    );
    if (ok) {
      document.getElementById("photoInput")?.click();
    }
  };

  // ✅ Delete Account
  const deleteAccount = async () => {
    try {
      const user = await ensureAnonAuth();

      // Delete Firestore profile
      await deleteDoc(doc(db, 'profiles', user.uid));

      // Delete Auth account
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
      }

      alert("✅ Your account has been deleted.");
      window.location.href = "/";
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert(`Delete failed: ${err?.code || ''} ${err?.message || err}`);
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

          {/* Upload photo button with permission */}
          <div className="form-group" style={{ textAlign: "center" }}>
            <label className="upload-btn" onClick={requestPhotoPermission}>
              Upload new photo
            </label>
            <input
              id="photoInput"
              type="file"
              accept="image/*"
              onChange={uploadPhoto}
              hidden
            />
          </div>

          {/* Form fields */}
          <div className="form-group">
            <label>Name</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Bio</span>
              <span style={{ fontSize: '12px', color: bio.length > BIO_MAX * 0.9 ? '#e3342f' : '#aaa' }}>
                {bio.length}/{BIO_MAX}
              </span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => { if (e.target.value.length <= BIO_MAX) setBio(e.target.value); }}
              placeholder="e.g. Product designer · open to collabs"
            />
          </div>

          <div style={{ fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '8px 0 4px' }}>
            Contact methods
          </div>

          <div className="form-group">
            <label><FaInstagram size={14} style={{ marginRight: 5, color: '#E1306C', verticalAlign: 'middle' }} />Instagram</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
              <span style={{ padding: '8px 10px', background: '#f5f5f5', color: '#888', fontSize: '14px', borderRight: '1px solid #ddd' }}>@</span>
              <input
                style={{ border: 'none', outline: 'none', flex: 1, padding: '8px 10px', fontSize: '14px' }}
                value={ig}
                onChange={(e) => setIg(e.target.value.replace('@', ''))}
                placeholder="username"
              />
            </div>
          </div>

          <div className="form-group">
            <label><FaLinkedin size={14} style={{ marginRight: 5, color: '#0077B5', verticalAlign: 'middle' }} />LinkedIn</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
              <span style={{ padding: '8px 6px 8px 10px', background: '#f5f5f5', color: '#888', fontSize: '12px', borderRight: '1px solid #ddd', whiteSpace: 'nowrap' }}>linkedin.com/in/</span>
              <input
                style={{ border: 'none', outline: 'none', flex: 1, padding: '8px 10px', fontSize: '14px' }}
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="username"
              />
            </div>
          </div>

          <div className="form-group">
            <label><FaWhatsapp size={14} style={{ marginRight: 5, color: '#25D366', verticalAlign: 'middle' }} />WhatsApp</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <select
                value={countryDial}
                onChange={(e) => setCountryDial(e.target.value)}
                style={{ width: '130px', flexShrink: 0, borderRadius: '8px', border: '1px solid #ddd', padding: '8px 4px', fontSize: '14px' }}
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.name} value={c.dial}>{c.flag} {c.dial}</option>
                ))}
              </select>
              <input
                style={{ flex: 1 }}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="XXXXXXXXX"
                type="tel"
              />
            </div>
            <div style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>Only shared when you both connect</div>
          </div>

          <button className="btn" onClick={save}>Save Profile</button>
          {status && <div className="status">{status}</div>}

          {/* ✅ Privacy footer */}
          <div className="privacy-bar">
            <a href="/privacy-policy">
              Privacy-first: session-based presence, no exact GPS stored.
            </a>
          </div>

          {/* ✅ Delete Account link */}
          {!showDeleteConfirm ? (
            <div style={{ marginTop: "24px", textAlign: "center" }}>
              <a
                href="#"
                style={{ color: "#e3342f", fontSize: "14px" }}
                onClick={(e) => {
                  e.preventDefault();
                  setShowDeleteConfirm(true);
                }}
              >
                Delete my account
              </a>
            </div>
          ) : (
            <div style={{ marginTop: "16px", textAlign: "center" }}>
              <p style={{ marginBottom: "8px", fontSize: "14px" }}>
                Type <strong>{firstName || "your name"}</strong> to confirm deletion:
              </p>
              <input
                value={verifyName}
                onChange={(e) => setVerifyName(e.target.value)}
                placeholder="Enter your name"
                className="border p-2 rounded w-full"
              />
              <button
                disabled={verifyName !== firstName}
                onClick={deleteAccount}
                className="btn danger"
                style={{
                  marginTop: "10px",
                  backgroundColor: verifyName === firstName ? "#e3342f" : "#aaa",
                  color: "#fff",
                }}
              >
                Confirm Delete
              </button>
            </div>
          )}
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
