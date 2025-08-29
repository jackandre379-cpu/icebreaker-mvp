export const metadata = {
  title: 'Icebreaker MVP',
  description: 'Discreet, mutual contact exchange'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Inter, system-ui, Arial, sans-serif', maxWidth: 700, margin: '0 auto', padding: 16 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <a href="/" style={{ textDecoration: 'none', fontWeight: 700, fontSize: 18 }}>Icebreaker</a>
          <nav style={{ display: 'flex', gap: 12 }}>
            <a href="/checkin">Check in</a>
            <a href="/nearby">Nearby</a>
            <a href="/requests">Requests</a>
            <a href="/profile">Profile</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer style={{ marginTop: 32, fontSize: 12, color: '#666' }}>
          Privacy-first: session-based presence, no exact GPS stored.
        </footer>
      </body>
    </html>
  );
}
