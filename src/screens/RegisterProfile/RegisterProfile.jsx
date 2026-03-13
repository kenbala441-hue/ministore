import React, { useState, useEffect } from "react";
import PageWrapper from "../auth/components/PageWrapper";
import AuthForm from "../auth/components/AuthForm";
import { auth, db, googleProvider } from "../../firebase/index.js"; 

import { useUserContext } from "../users/userContext";

import {
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";

export default function RegisterProfile({ setView }) {

  const { setUser } = useUserContext();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {

    const init = async () => {
      try {

        const cached = localStorage.getItem("comiccraft_last_user");

        if (cached) {
          const parsed = JSON.parse(cached);
          console.log("Utilisateur précédent :", parsed?.email || parsed?.uid);
        }

      } catch (err) {
        console.warn("Erreur cache utilisateur");
      }

      setInitializing(false);
    };

    init();

  }, []);

  const checkUserProfile = async (user) => {

    try {

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        setView("register");
        return;
      }

      const data = snap.data();

      if (!data?.acceptedTerms) {
        setView("terms");
        return;
      }

      if (!data?.completedProfile) {
        setView("register");
        return;
      }

      await updateDoc(userRef, {
        lastLogin: serverTimestamp()
      });

      setView("home");

    } catch (err) {

      console.error("Erreur vérification profil :", err);
      setError("Impossible de vérifier le profil.");

    }

  };

  const handleLogin = async (email, password) => {

    setError("");
    setLoading(true);

    try {

      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = credential.user;

      setUser(user);

      localStorage.setItem(
        "comiccraft_last_user",
        JSON.stringify({
          uid: user.uid,
          email: user.email
        })
      );

      await checkUserProfile(user);

    } catch (err) {

      console.error("Erreur login :", err);
      setError("Email ou mot de passe incorrect");

    }

    setLoading(false);

  };

  const handleGoogle = async () => {

    setError("");
    setLoading(true);

    try {

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      setUser(user);

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {

        await setDoc(userRef, {
          uid: user.uid,
          email: user.email || "",
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          acceptedTerms: false,
          completedProfile: false,
          provider: "google"
        });

      } else {

        await updateDoc(userRef, {
          lastLogin: serverTimestamp()
        });

      }

      localStorage.setItem(
        "comiccraft_last_user",
        JSON.stringify({
          uid: user.uid,
          email: user.email
        })
      );

      await checkUserProfile(user);

    } catch (err) {

      console.error("Erreur Google login :", err);
      setError("Erreur connexion Google");

    }

    setLoading(false);

  };

  if (initializing) {

    return (
      <PageWrapper>
        <div
          style={{
            width: "100%",
            textAlign: "center",
            paddingTop: "120px",
            fontSize: "14px",
            color: "#aaa"
          }}
        >
          Chargement...
        </div>
      </PageWrapper>
    );

  }

  return (

    <PageWrapper>

      <AuthForm
        title="Bienvenue sur Comiccrafte"
        subtitle="Connectez-vous pour continuer"
        onSubmit={handleLogin}
        buttonText={loading ? "Connexion..." : "Se connecter"}
        onGoogleClick={handleGoogle}
        toggleText="Pas encore de compte ?"
        toggleAction={() => setView("register")}
        disabled={loading}
      />

      {error && (

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center"
          }}
        >

          <p
            style={{
              color: "#ff4d4f",
              textAlign: "center",
              fontSize: "14px",
              background: "#111",
              padding: "10px 16px",
              borderRadius: "10px",
              border: "1px solid #330000",
              maxWidth: "260px"
            }}
          >
            {error}
          </p>

        </div>

      )}

    </PageWrapper>

  );

}