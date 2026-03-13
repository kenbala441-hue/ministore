// 🔥 src/firebase/index.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ✅ CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyAalUx5YEWq1Bs9HW_VFiqqqZpWenW69CA",
  authDomain: "comiccrafte-studio.firebaseapp.com",
  projectId: "comiccrafte-studio",
  storageBucket: "comiccrafte-studio.firebasestorage.app",
  messagingSenderId: "322099627324",
  appId: "1:322099627324:web:f3298dac6afcd3e0faca39"
};

// 🔥 INITIALISATION APP
export const app = initializeApp(firebaseConfig);

// 🔐 AUTH
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// 🗄️ FIRESTORE
export const db = getFirestore(app);

// 📦 STORAGE (UPLOAD IMAGES)
export const storage = getStorage(app);