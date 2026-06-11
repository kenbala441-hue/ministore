// 🔥 src/firebase/index.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ✅ CONFIGURATION UNIQUE ET DIRECTE
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

// 🗄️ FIRESTORE (MODE OFFLINE)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

// 📦 STORAGE
export const storage = getStorage(app);

/* ============================================================
   🔹 LOGIN + AUTO ROLE AUTHOR
============================================================ */
export async function loginAndActivateAuthor(email, password) {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    const isAdminTest = email === "kenmikael27@gmail.com";

    if (!userSnap.exists() || isAdminTest) {
      await setDoc(
        userRef,
        {
          email: user.email,
          username: user.email.split("@")[0],
          role: "author",
          updatedAt: serverTimestamp(),
          createdAt: userSnap.exists() ? undefined : serverTimestamp(),
        },
        { merge: true }
      );
    }

    return { uid: user.uid, email: user.email, role: "author" };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}
