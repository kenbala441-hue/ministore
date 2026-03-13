import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";

const provider = new GoogleAuthProvider();

export async function registerWithEmail(email, password) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(result.user);
    return result.user;
  } catch (err) {
    console.error("Erreur enregistrement:", err);
    throw new Error(err.message || "Impossible de créer le compte");
  }
}

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err) {
    console.error("Erreur connexion Google:", err);
    throw new Error(err.message || "Connexion Google échouée");
  }
}