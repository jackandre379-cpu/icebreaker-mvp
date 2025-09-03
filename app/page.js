'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="page">
      <div className="card home-card">
        <h1 className="title">Real connections, without awkwardness.</h1>
        <p className="subtitle">
          This MVP lets you discreetly connect with people around you.<br />
          Only mutual consent shares contact details.
        </p>

        <div className="actions">
          <Link href="/checkin" className="btn primary">
            I’m here → Check in
          </Link>
          <Link href="/nearby" className="btn">
            See who’s nearby
          </Link>
          <Link href="/requests" className="btn">
            View requests
          </Link>
          <Link href="/profile" className="btn">
            Edit my profile
          </Link>
        </div>
      </div>
    </div>
  );
}
