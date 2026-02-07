import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // <-- AJOUTÉ

const firebaseConfig = {
  apiKey: "TON_API_KEY",
  authDomain: "comiccrafte.firebaseapp.com",
  projectId: "comiccrafte",
  storageBucket: "comiccrafte.appspot.com",
  messagingSenderId: "TON_ID",
  appId: "TON_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // <-- LE SERVEUR DE DONNÉES
export const provider = new GoogleAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, provider);

