'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <div className="card" style={{ flexDirection: "column", textAlign: "center" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>
          Real connections, without awkwardness.
        </h1>
        <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "20px" }}>
          This MVP lets you discreetly connect with people around you.<br />
          Only mutual consent shares contact details.
        </p>

        <div style={{ display: "grid", gap: "10px", width: "100%" }}>
          <Link href="/checkin" className="btn">
            I’m here → Check in
          </Link>
          <Link href="/nearby" className="btn decline">
            See who’s nearby
          </Link>
          <Link href="/requests" className="btn decline">
            View requests
          </Link>
          <Link href="/profile" className="btn decline">
            Edit my profile
          </Link>
        </div>
      </div>
    </main>
  );
}
