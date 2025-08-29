'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h1>Real connections, without awkwardness.</h1>
      <p>This MVP lets you discreetly connect with people around you. Only mutual consent shares contact details.</p>
      <div style={{ display: 'grid', gap: 8 }}>
        <Link className="btn" href="/checkin">I’m here → Check in</Link>
        <Link className="btn" href="/nearby">See who’s nearby</Link>
        <Link className="btn" href="/requests">View requests</Link>
        <Link className="btn" href="/profile">Edit my profile</Link>
      </div>
      <style jsx>{`
        .btn {
          display: inline-block;
          padding: 12px 16px;
          background: black;
          color: white;
          border-radius: 10px;
          text-align: center;
          text-decoration: none;
          width: fit-content;
        }
        .btn:hover { opacity: 0.9; }
      `}</style>
    </div>
  );
}
