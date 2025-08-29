'use client';

export default function ProfileCard({ profile, onConnect }) {
  const firstName = profile.firstName || 'Anonymous';
  const bio = profile.bio || '';
  const photoURL = profile.photoURL || '';
  const initials = (firstName?.trim()?.[0] || '?').toUpperCase();

  return (
    <div
      style={{
        border: '1px solid #eee',
        borderRadius: 12,
        padding: 12,
        display: 'grid',
        gridTemplateColumns: '56px 1fr auto',
        gap: 12,
        alignItems: 'center'
      }}
    >
      <Avatar photoURL={photoURL} initials={initials} />
      <div style={{ display: 'grid', gap: 4 }}>
        <div style={{ fontWeight: 700 }}>{firstName}</div>
        {bio && <div style={{ fontSize: 12, color: '#666' }}>{bio}</div>}
      </div>
      <button
        onClick={onConnect}
        style={{
          padding: '8px 10px',
          borderRadius: 8,
          background: 'black',
          color: 'white',
          whiteSpace: 'nowrap'
        }}
      >
        Connect
      </button>
    </div>
  );
}

function Avatar({ photoURL, initials }) {
  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt="Profile"
        width={56}
        height={56}
        style={{ borderRadius: '50%', objectFit: 'cover', display: 'block' }}
      />
    );
  }
  return (
    <div
      style={{
        width: 56,
        height: 56,
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
