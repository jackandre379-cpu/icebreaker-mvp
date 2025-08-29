'use client';

import { useState } from 'react';

export default function ShareModal({ open, onClose, onSend }) {
  const [shareIG, setShareIG] = useState(true);
  const [sharePhone, setSharePhone] = useState(false);
  const [shareLinkedIn, setShareLinkedIn] = useState(false);

  if (!open) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>Choose what to share</h3>
        <label><input type="checkbox" checked={shareIG} onChange={e=>setShareIG(e.target.checked)} /> Instagram</label>
        <label><input type="checkbox" checked={sharePhone} onChange={e=>setSharePhone(e.target.checked)} /> Phone</label>
        <label><input type="checkbox" checked={shareLinkedIn} onChange={e=>setShareLinkedIn(e.target.checked)} /> LinkedIn</label>
        <div style={{ display:'flex', gap: 8, marginTop: 12 }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={()=>onSend({ ig: shareIG, phone: sharePhone, linkedin: shareLinkedIn })} style={{ background:'black', color:'white', borderRadius:8, padding:'6px 10px' }}>Send Request</button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
  display: 'grid', placeItems: 'center', zIndex: 50
};

const modalStyle = {
  background: 'white', borderRadius: 12, padding: 16, width: 320, display:'grid', gap: 8
};
