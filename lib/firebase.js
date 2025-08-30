import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, // ✅ must be firebasestorage.app
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app, "gs://icebreaker-c7659.firebasestorage.app");

// Ensure anonymous auth
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
            console.log("✅ User signed in:", user.uid);
            authReady = true;
            resolve(user);
          } else {
            console.log("⚠️ No user, signing in anonymously...");
            signInAnonymously(auth)
              .then((cred) => {
                console.log("✅ Signed in anonymously:", cred.user.uid);
                authReady = true;
                resolve(cred.user);
              })
              .catch(reject);
          }
        },
        reject
      );
    });
  }

  return authPromise;
}
