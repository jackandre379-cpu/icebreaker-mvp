'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* ===== Header ===== */}
      <header className="page-header">
        Icebreaker
      </header>

      {/* ===== Main Content ===== */}
      <main className="page" style={{ alignItems: "center" }}>
        <div className="card">
          {/* Title */}
          <h2>Real connections, without awkwardness.</h2>
          <p>
            Meet people nearby, check in at cafés, <br />
            and connect only when it’s mutual.
          </p>

          {/* Actions */}
          <div style={{ display: "grid", gap: "12px", width: "100%" }}>
            <Link href="/checkin" className="btn">
              I’m here → Check in
            </Link>
            <Link href="/nearby" className="btn decline">
              See who’s nearby
            </Link>
            <Link href="/profile" className="btn decline">
              My profile
            </Link>
          </div>

          {/* Safety Note */}
          <div className="privacy-bar" style={{ borderTop: "none", marginTop: "16px" }}>
            🔒 Your contact details are shared only when both sides agree.
          </div>
        </div>
      </main>

      {/* ===== Footer ===== */}
      <footer className="footer-bar">
  © {new Date().getFullYear()} Icebreaker · <a href="/privacy-policy">Privacy</a> · <a href="#">Terms</a>
</footer>

    </>
  );
}
