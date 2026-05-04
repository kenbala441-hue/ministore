import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../firebase/index.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot, setDoc, updateDoc, increment, getDoc } from "firebase/firestore";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userDocRef = doc(db, "users", firebaseUser.uid);

        // 1. LOGIQUE BANQUE : UNE SEULE FOIS AU LOGIN
        try {
          const docSnap = await getDoc(userDocRef);
          const today = new Date().toDateString();

          if (docSnap.exists()) {
            const data = docSnap.data();
            // Bonus journalier de 5 Inks pour le Studio ComicCrafte
            if (data.lastCheckIn !== today) {
              await updateDoc(userDocRef, {
                inks: increment(5),
                lastCheckIn: today
              });
            }
          } else {
            // Création du profil Jordan M.G. / Kinkarou Daiko si nouveau
            await setDoc(userDocRef, {
              uid: firebaseUser.uid,
              username: firebaseUser.displayName || "Membre CC",
              photoURL: firebaseUser.photoURL || "",
              inks: 100, // Cadeau de bienvenue
              role: "standard",
              lastCheckIn: today,
              createdAt: new Date().toISOString()
            });
          }
        } catch (err) {
          console.error("Erreur Banque Firestore:", err);
        }

        // 2. ÉCOUTEUR SANS ÉCRITURE (POUR ÉVITER LES BUGS)
        const unsubscribeData = onSnapshot(userDocRef, (snap) => {
          if (snap.exists()) setUserData(snap.data());
          setLoading(false);
        });

        return () => unsubscribeData();
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const logout = () => signOut(auth);

  return (
    <UserContext.Provider value={{ user, userData, logout, loading, setUser }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
export const useUser = () => useUserContext();