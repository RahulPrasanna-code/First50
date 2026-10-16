import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "your-api-key" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "your-project-id"
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.warn("Firebase initialization skipped or failed, falling back to LocalStorage:", error);
    app = null;
    auth = null;
    db = null;
  }
}

export { app, auth, db };

export async function signInWithGoogle(): Promise<User | null> {
  if (!auth) {
    console.info("Firebase Auth not initialized. Operating in local-first demo mode.");
    return null;
  }
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err: any) {
    console.error("Firebase Sign-In Error:", err);
    if (err.code === "auth/unauthorized-domain" && typeof window !== "undefined") {
      alert(
        `Firebase Auth Authorization Needed:\n\nPlease add "${window.location.hostname}" to Firebase Console:\nAuthentication > Settings > Authorized domains`
      );
    } else if (err.code !== "auth/popup-closed-by-user" && typeof window !== "undefined") {
      alert(`Sign-in could not complete: ${err.message}`);
    }
    return null;
  }
}

export async function signOutUser(): Promise<void> {
  if (auth) {
    await signOut(auth);
  }
}

export function subscribeToAuth(callback: (user: User | null) => void): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
