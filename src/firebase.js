// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 CONFIG OFFICIELLE COMICCRAFTE STUDIO
const firebaseConfig = {
  apiKey: "AIzaSyAalUx5YEWq1Bs9HW_VFiqqqZpWenW69CA",
  authDomain: "comiccrafte-studio.firebaseapp.com",
  projectId: "comiccrafte-studio",
  storageBucket: "comiccrafte-studio.firebasestorage.app",
  messagingSenderId: "322099627324",
  appId: "1:322099627324:web:f3298dac6afcd3e0faca39"
};

// INITIALISATION
const app = initializeApp(firebaseConfig);

// AUTH
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// GOOGLE LOGIN
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
};

// FIRESTORE
export const db = getFirestore(app);

// OBSERVER USER
export const onUserStateChange = (callback) =>
  onAuthStateChanged(auth, callback);