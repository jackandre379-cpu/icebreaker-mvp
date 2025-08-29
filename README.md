# Icebreaker MVP (Next.js + Firebase)

A privacy-first, location-based MVP for exchanging contact details **only when both people agree**.

## Features
- **Check-in** to a venue (we store only a coarse venue bucket, not exact GPS).
- **Nearby users**: see others who checked into the same venue bucket.
- **Send/accept requests** with per-connection control over what you share (IG, phone, LinkedIn, etc.).
- **Anonymous Auth**: frictionless onboarding.
- **Realtime** via Firestore.

## Quick Start
1. Create a Firebase project → enable **Firestore** & **Anonymous Authentication**.
2. Copy `.env.local.example` to `.env.local` and fill with Firebase config values.
3. Install & run:
   ```bash
   npm install
   npm run dev
   ```
4. Open `http://localhost:3000`

## Environment Variables
Create `.env.local` with:
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Firestore Structure (MVP)
- `profiles/{uid}` → { firstName, photoURL?, shareIG?, sharePhone?, shareLinkedIn?, ig?, phone?, linkedin? }
- `sessions/{uid}` → { uid, venueBucket, updatedAt }
- `requests/{requestId}` → { fromUid, toUid, venueBucket, status: 'pending'|'accepted'|'declined', fieldsFrom, createdAt, respondedAt? }
- `connections/{connectionId}` → { aUid, bUid, venueBucket, fieldsAtoB, fieldsBtoA, createdAt }

> **Privacy:** We don't store raw GPS. `venueBucket` is derived from rounded lat/lng.

## Notes
- This is a **web MVP** (PWA-friendly). It runs great on phones via browser and can be wrapped later into a mobile app.
- You can deploy to **Vercel** easily after adding `.env` and setting Firebase rules.
# icebreaker-mvp
