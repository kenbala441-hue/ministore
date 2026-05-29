import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

import {
  auth,
  db,
} from "../../firebase/index.js";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  doc,
  onSnapshot,
} from "firebase/firestore";

// =========================
// USER CONTEXT
// STRICT FIREBASE VERSION
// =========================

const UserContext =
  createContext(null);

// =========================
// PROVIDER
// =========================

export const UserProvider = ({
  children,
}) => {

  // =========================
  // STATES
  // =========================

  const [user, setUser] =
    useState(null);

  const [userData, setUserData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [initialized,
    setInitialized] =
    useState(false);

  // =========================
  // AUTH LISTENER
  // =========================

  useEffect(() => {

    let unsubscribeData =
      null;

    const unsubscribeAuth =
      onAuthStateChanged(
        auth,
        async (
          firebaseUser
        ) => {

          // =========================
          // RESET
          // =========================

          if (
            unsubscribeData
          ) {

            unsubscribeData();

            unsubscribeData =
              null;

          }

          // =========================
          // NO USER
          // =========================

          if (
            !firebaseUser
          ) {

            setUser(null);

            setUserData(null);

            setLoading(false);

            setInitialized(true);

            return;

          }

          // =========================
          // AUTH USER
          // =========================

          setUser(
            firebaseUser
          );

          // =========================
          // USER DOC
          // =========================

          const userRef =
            doc(
              db,
              "users",
              firebaseUser.uid
            );

          // =========================
          // REALTIME LISTENER
          // NO AUTO WRITES
          // =========================

          unsubscribeData =
            onSnapshot(
              userRef,

              // =========================
              // SUCCESS
              // =========================

              (snap) => {

                if (
                  snap.exists()
                ) {

                  const data =
                    snap.data();

                  // =========================
                  // SAFE USER DATA
                  // STRICT RULES SAFE
                  // =========================

                  setUserData({

                    uid:
                      data.uid || "",

                    // 🔥 IMPORTANT
                    // RULES USE "name"
                    name:
                      data.name || "",

                    username:
                      data.username || "",

                    bio:
                      data.bio || "",

                    birthday:
                      data.birthday || "",

                    role:
                      data.role || "user",

                    email:
                      data.email || "",

                    photoURL:
                      data.photoURL || "",

                    provider:
                      data.provider || "",

                    verified:
                      data.verified || false,

                    acceptedTerms:
                      data.acceptedTerms || false,

                    completedProfile:
                      data.completedProfile || false,

                    createdAt:
                      data.createdAt || null,

                    lastLogin:
                      data.lastLogin || null,

                  });

                } else {

                  // =========================
                  // USER DOC MISSING
                  // =========================

                  setUserData(null);

                }

                setLoading(false);

                setInitialized(true);

              },

              // =========================
              // ERROR
              // =========================

              (error) => {

                console.error(
                  "Firestore Listener Error:",
                  error
                );

                setUserData(null);

                setLoading(false);

                setInitialized(true);

              }
            );

        }
      );

    // =========================
    // CLEANUP
    // =========================

    return () => {

      if (
        unsubscribeData
      ) {

        unsubscribeData();

      }

      unsubscribeAuth();

    };

  }, []);

  // =========================
  // LOGOUT
  // =========================

  const logout =
    async () => {

      try {

        await signOut(auth);

      } catch (error) {

        console.error(
          "Logout Error:",
          error
        );

      }

    };

  // =========================
  // HELPERS
  // =========================

  const isAdmin =
    userData?.role ===
    "admin";

  const isAuthor =
    userData?.role ===
    "author";

  const isUser =
    userData?.role ===
    "user";

  const profileCompleted =
    userData?.completedProfile === true;

  // =========================
  // MEMO VALUE
  // =========================

  const contextValue =
    useMemo(() => ({

      // AUTH
      user,
      setUser,

      // FIRESTORE
      userData,

      // STATUS
      loading,
      initialized,

      // ROLES
      isAdmin,
      isAuthor,
      isUser,

      // PROFILE
      profileCompleted,

      // ACTIONS
      logout,

    }), [

      user,
      userData,
      loading,
      initialized,
      isAdmin,
      isAuthor,
      isUser,
      profileCompleted,

    ]);

  // =========================
  // PROVIDER
  // =========================

  return (

  <UserContext.Provider
    value={
      contextValue
    }
  >

    {
      initialized
        ? children
        : (

          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#0f0f14",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >

            Chargement de ComicCraft...

          </div>

        )
    }

  </UserContext.Provider>

 );
};
// =========================
// HOOKS
// =========================

export const useUserContext =
  () =>
    useContext(
      UserContext
    );

export const useUser =
  () =>
    useUserContext();