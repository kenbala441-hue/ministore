import { auth, googleProvider } from "./index.js";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";

// LOGIN GOOGLE
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
};

// LOGOUT
export const logout = () => signOut(auth);

// OBSERVER USER
export const onUserStateChange = (callback) =>
  onAuthStateChanged(auth, callback);