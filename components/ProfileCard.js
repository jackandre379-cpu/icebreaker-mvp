'use client';

export default function ProfileCard({ profile, onConnect }) {
  const firstName = profile.firstName || 'Anonymous';
  const bio = profile.bio || '';
  const photoURL = profile.photoURL || '';
  const initials = (firstName?.trim()?.[0] || '?').toUpperCase();

  return (
    <div className="profile-row">
      <Avatar photoURL={photoURL} initials={initials} size="sm" />
      <div className="profile-text">
        <div className="profile-name">{firstName}</div>
        {bio && <div className="profile-bio">{bio}</div>}
      </div>
      <button onClick={onConnect} className="btn">Connect</button>
    </div>
  );
}

function Avatar({ photoURL, initials, size = "sm" }) {
  return (
    <div
      className={`avatar ${size}`}
      style={photoURL ? { backgroundImage: `url(${photoURL})` } : {}}
    >
      {!photoURL && initials}
    </div>
  );
}
