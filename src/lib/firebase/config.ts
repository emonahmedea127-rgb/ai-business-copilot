import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
  measurementId: firebaseConfig.measurementId
});

// Auth instance
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Firestore instance (with specific named database if configured)
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Helper to sign in with Google Popup
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Sync / create profile in Firestore
  if (user) {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        photoURL: user.photoURL || '',
        role: 'owner',
        isVerified: user.emailVerified || true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      await updateDoc(userRef, {
        updatedAt: new Date().toISOString(),
        displayName: user.displayName || userSnap.data()?.displayName,
        photoURL: user.photoURL || userSnap.data()?.photoURL,
      });
    }
  }

  return user;
}

// Helper to sign out
export async function logOutUser() {
  await firebaseSignOut(auth);
}

// User Profile Data Types in Firestore
export interface FirestoreUserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'owner' | 'admin' | 'analyst' | 'viewer';
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FirestoreUserStore {
  id: string;
  userId: string;
  name: string;
  platform: string;
  currency: string;
  domain?: string;
  connectedAt: string;
  status: string;
}

// Firestore operations
export async function syncUserProfile(user: FirebaseUser, extra?: { role?: string; displayName?: string }) {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    const newProfile: FirestoreUserProfile = {
      id: user.uid,
      email: user.email || '',
      displayName: extra?.displayName || user.displayName || user.email?.split('@')[0] || 'User',
      photoURL: user.photoURL || undefined,
      role: (extra?.role as FirestoreUserProfile['role']) || 'owner',
      isVerified: user.emailVerified,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(userRef, newProfile);
    return newProfile;
  } else {
    const existing = snap.data() as FirestoreUserProfile;
    return existing;
  }
}

export async function getUserProfile(userId: string): Promise<FirestoreUserProfile | null> {
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return snap.data() as FirestoreUserProfile;
  }
  return null;
}

export {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
};
