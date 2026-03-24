// 🔥 src/firebase/index.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
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

/**
 * 🔹 Connexion avec email + activation rôle author automatique
 */
export async function loginAndActivateAuthor(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  // Si email match notre email de test ou nouveau utilisateur, ajout role author
  if (!userSnap.exists() || user.email === "kenmikael27@gmail.com") {
    await setDoc(userRef, {
      email: user.email,
      username: user.email.split("@")[0],
      role: "author",
      createdAt: new Date()
    });
  }

  return { uid: user.uid, email: user.email, role: "author" };
}