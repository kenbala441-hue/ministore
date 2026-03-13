import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../firebase/index.js";
import { onAuthStateChanged, signOut } from "firebase/auth";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Connexion automatique Firebase
  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {

      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }

      setLoading(false);

    });

    return () => unsubscribe();

  }, []);

  // 🔹 Logout propre
  const logout = async () => {

    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Erreur logout :", err);
    }

  };

  const value = {
    user,
    setUser,
    logout,
    loading
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};


// Hook principal
export const useUserContext = () => {

  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      "useUserContext doit être utilisé dans un UserProvider"
    );
  }

  return context;

};


// ✅ Alias pour compatibilité avec les anciens fichiers
export const useUser = () => {
  return useUserContext();
};