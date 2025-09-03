'use client';

export default function ProfileCard({ profile, onConnect }) {
  const firstName = profile.firstName || 'Anonymous';
  const bio = profile.bio || '';
  const photoURL = profile.photoURL || '';
  const initials = (firstName?.trim()?.[0] || '?').toUpperCase();

  return (
    <div className="profile-row">
      <div className="profile-info">
        <Avatar photoURL={photoURL} initials={initials} />
        <div className="profile-text">
          <div className="profile-name">{firstName}</div>
          {bio && <div className="profile-bio">{bio}</div>}
        </div>
      </div>

      <button onClick={onConnect} className="btn primary">
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
        className="profile-photo"
      />
    );
  }
  return (
    <div className="profile-photo" aria-label="No profile photo">
      <span style={{ fontWeight: 700 }}>{initials}</span>
    </div>
  );
}
