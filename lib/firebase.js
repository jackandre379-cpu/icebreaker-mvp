// lib/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, // e.g. icebreaker-c7659.appspot.com
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId is optional
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ create Storage bound to the exact bucket (avoids default mismatch)
export const storage = getStorage(app, `gs://${firebaseConfig.storageBucket}`);

let authReady = false;
let authPromise = null;

export function ensureAnonAuth() {
  if (authReady) return Promise.resolve(auth.currentUser);
  if (!authPromise) {
    authPromise = new Promise((resolve, reject) => {
      onAuthStateChanged(
        auth,
        (user) => {
          if (user) {
            authReady = true;
            resolve(user);
          } else {
            signInAnonymously(auth)
              .then((cred) => {
                authReady = true;
                resolve(cred.user);
              })
              .catch((e) => reject(new Error(`Anon auth failed: ${e.code || e.message}`)));
          }
        },
        (err) => reject(new Error(`Auth observer error: ${err?.message || err}`))
      );
    });
  }
  return authPromise;
}
