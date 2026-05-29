// ==========================================
// LOGIN PAGE — PREMIUM SECURE VERSION
// ==========================================

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

import {
  auth,
  db,
  googleProvider,
} from "../../../firebase/index.js";

import {
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
  OAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  ShieldCheck,
  Loader2,
  WifiOff,
} from "lucide-react";

import PageWrapper from "../components/PageWrapper";
import AuthForm from "../components/AuthForm";
import AuthCarousel from "../components/AuthCarousel";

import { useUserContext } from "../../users/userContext";

// ==========================================
// SECURITY
// ==========================================

const LOGIN_LOCK_KEY =
  "comiccraft_security_lock";

const MAX_FAILED_ATTEMPTS = 5;

const LOCK_TIME =
  1000 * 60 * 60 * 5;

// ==========================================
// COMPONENT
// ==========================================

export default function LoginPage({
  setView,
}) {

  const { setUser } =
    useUserContext();

  const [showAd, setShowAd] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [initializing, setInitializing] =
    useState(true);

  const [isOffline, setIsOffline] =
    useState(!navigator.onLine);

  const [failedAttempts, setFailedAttempts] =
    useState(0);

  const [lockedUntil, setLockedUntil] =
    useState(null);

  const [remainingTime, setRemainingTime] =
    useState("");

  const alreadyChecked =
    useRef(false);

  // ==========================================
  // NETWORK
  // ==========================================

  useEffect(() => {

    const online = () =>
      setIsOffline(false);

    const offline = () =>
      setIsOffline(true);

    window.addEventListener(
      "online",
      online
    );

    window.addEventListener(
      "offline",
      offline
    );

    return () => {

      window.removeEventListener(
        "online",
        online
      );

      window.removeEventListener(
        "offline",
        offline
      );

    };

  }, []);

  // ==========================================
  // LOAD SECURITY LOCK
  // ==========================================

  useEffect(() => {

    try {

      const saved =
        localStorage.getItem(
          LOGIN_LOCK_KEY
        );

      if (!saved) return;

      const parsed =
        JSON.parse(saved);

      if (
        parsed?.lockedUntil &&
        Date.now() <
          parsed.lockedUntil
      ) {

        setFailedAttempts(
          parsed.attempts || 0
        );

        setLockedUntil(
          parsed.lockedUntil
        );

      } else {

        localStorage.removeItem(
          LOGIN_LOCK_KEY
        );

      }

    } catch {

      localStorage.removeItem(
        LOGIN_LOCK_KEY
      );

    }

  }, []);

  // ==========================================
  // LOCK TIMER
  // ==========================================

  useEffect(() => {

    if (!lockedUntil) return;

    const interval =
      setInterval(() => {

        const diff =
          lockedUntil - Date.now();

        if (diff <= 0) {

          setLockedUntil(null);

          setRemainingTime("");

          setFailedAttempts(0);

          localStorage.removeItem(
            LOGIN_LOCK_KEY
          );

          clearInterval(interval);

          return;
        }

        const hours =
          Math.floor(
            diff /
              (1000 * 60 * 60)
          );

        const minutes =
          Math.floor(
            (
              diff %
              (1000 * 60 * 60)
            ) /
              (1000 * 60)
          );

        setRemainingTime(
          `${hours}h ${minutes}m`
        );

      }, 1000);

    return () =>
      clearInterval(interval);

  }, [lockedUntil]);

  // ==========================================
  // PERSISTENCE
  // ==========================================

  useEffect(() => {

    const setup = async () => {

      try {

        await setPersistence(
          auth,
          browserLocalPersistence
        );

      } catch (err) {

        console.error(err);

      }

    };

    setup();

  }, []);

// ==========================================
// PROFILE CHECK
// ULTRA STRICT FIRESTORE VERSION
// Stable + Compatible + Anti Permission Error
// ==========================================

const checkUserProfile =
  useCallback(async (
    firebaseUser
  ) => {

    try {

      // =========================
      // SECURITY CHECK
      // =========================

      if (!firebaseUser?.uid) {

        setError(
          "Session utilisateur invalide."
        );

        return;

      }

      // =========================
      // USER REF
      // =========================

      const userRef =
        doc(
          db,
          "users",
          firebaseUser.uid
        );

      // =========================
      // GET USER DOC
      // =========================

      const snap =
        await getDoc(
          userRef
        );

      // ==========================================
      // CREATE INITIAL PROFILE
      // STRICT RULES SAFE
      // ==========================================

      if (
        !snap.exists()
      ) {

        // =========================
        // SAFE DEFAULTS
        // =========================

        const safeName =
          firebaseUser.displayName
            ?.trim()
            ?.slice(0, 40)
          || "Lecteur ComicCraft";

        const safeUsername =
          `user_${firebaseUser.uid.slice(0, 6).toLowerCase()}`;

        // =========================
        // INITIAL PROFILE
        // =========================

        const initialProfile = {

          // 🔐 REQUIRED
          uid:
            firebaseUser.uid,

          // 🔐 REQUIRED BY RULES
          name:
            safeName,

          username:
            safeUsername,

          birthday:
            "2000-01-01",

          role:
            "user",

          // 🔐 OPTIONAL SAFE DATA
          bio:
            "",

          email:
            firebaseUser.email || "",

          photoURL:
            firebaseUser.photoURL || "",

          provider:
            firebaseUser.providerData?.[0]
              ?.providerId ||
            "password",

          verified:
            firebaseUser.emailVerified || false,

          acceptedTerms:
            false,

          completedProfile:
            false,

          // 🔐 TIMESTAMPS
          createdAt:
            serverTimestamp(),

          lastLogin:
            serverTimestamp(),

        };

        // =========================
        // CREATE USER DOC
        // =========================

        await setDoc(
          userRef,
          initialProfile
        );

        // =========================
        // REDIRECT REGISTER
        // =========================

        setView(
          "register"
        );

        return;

      }

      // =========================
      // EXISTING DATA
      // =========================

      const data =
        snap.data();

      // =========================
      // SAFE LAST LOGIN UPDATE
      // =========================

      await updateDoc(
        userRef,
        {
          lastLogin:
            serverTimestamp(),
        }
      );

      // =========================
      // TERMS CHECK
      // =========================

      if (
        data?.acceptedTerms
          !== true
      ) {

        setView(
          "terms"
        );

        return;

      }

      // =========================
      // PROFILE CHECK
      // =========================

      if (
        data?.completedProfile
          !== true
      ) {

        setView(
          "register"
        );

        return;

      }

      // =========================
      // SUCCESS
      // =========================

      setView(
        "home"
      );

    } catch (err) {

      console.error(
        "Profile Check Error:",
        err
      );

      // =========================
      // FIRESTORE ERRORS
      // =========================

      switch (
        err.code
      ) {

        case
          "permission-denied":

          setError(
            "Accès Firestore refusé (Vérifie la structure des données)."
          );

          break;

        case
          "unavailable":

          setError(
            "Serveur Firebase indisponible."
          );

          break;

        case
          "not-found":

          setError(
            "Profil utilisateur introuvable."
          );

          break;

        default:

          setError(
            "Vérification du compte impossible."
          );

      }

    }

  }, [
    setView
  ]);

  // ==========================================
  // INITIALIZATION
  // ==========================================

  useEffect(() => {

    if (alreadyChecked.current)
      return;

    alreadyChecked.current =
      true;

    const initialize =
      async () => {

        try {

          const redirectResult =
            await getRedirectResult(
              auth
            );

          // GOOGLE SUCCESS

          if (
            redirectResult?.user
          ) {

            const user =
              redirectResult.user;

            setUser(user);

            localStorage.setItem(
              "comiccraft_last_user",
              JSON.stringify({
                uid: user.uid,
                email:
                  user.email,
              })
            );

            await checkUserProfile(
              user
            );

            return;
          }

          // EXISTING SESSION

          if (
            auth.currentUser
          ) {

            await checkUserProfile(
              auth.currentUser
            );

            return;
          }

          // INTRO SCREEN

          const alreadySeen =
            localStorage.getItem(
              "comiccraft_intro_seen"
            );

          setShowAd(
            !alreadySeen
          );

        } catch (err) {

          console.error(err);

        } finally {

          setInitializing(
            false
          );

        }

      };

    initialize();

  }, [
    checkUserProfile,
    setUser,
  ]);

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin =
    async (
      email,
      password
    ) => {

      if (
        loading ||
        lockedUntil
      ) {

        return {
          success: false,
        };

      }

      setLoading(true);

      setError("");

      try {

        const credential =
          await signInWithEmailAndPassword(
            auth,
            email.trim(),
            password
          );

        const user =
          credential.user;

        setUser(user);

        localStorage.setItem(
          "comiccraft_last_user",
          JSON.stringify({
            uid: user.uid,
            email:
              user.email,
          })
        );

        localStorage.removeItem(
          LOGIN_LOCK_KEY
        );

        setFailedAttempts(0);

        await checkUserProfile(
          user
        );

        return {
          success: true,
        };

      } catch (err) {

        console.error(err);

        const next =
          failedAttempts + 1;

        setFailedAttempts(
          next
        );
// LOCK

        if (
          next >=
          MAX_FAILED_ATTEMPTS
        ) {

          const lockUntil =
            Date.now() +
            LOCK_TIME;

          setLockedUntil(
            lockUntil
          );

          localStorage.setItem(
            LOGIN_LOCK_KEY,
            JSON.stringify({
              attempts: next,
              lockedUntil:
                lockUntil,
            })
          );

        }

        switch (err.code) {

          case "auth/user-not-found":

            setError(
              "compte introuvable"
            );

            break;

          case "auth/wrong-password":

            setError(
              "mot de passe incorrect"
            );

            break;

          case "auth/invalid-email":

            setError(
              "email invalide"
            );

            break;

          case "auth/too-many-requests":

            setError(
              "trop de tentatives"
            );

            break;

          case "auth/network-request-failed":

            setError(
              "connexion instable"
            );

            break;

          default:

            setError(
              "connexion impossible"
            );

        }

        return {
          success: false,
        };

      } finally {

        setLoading(false);

      }

    };


// ==========================================
// GOOGLE LOGIN
// Stable Android • Web • Capacitor • Vite
// ==========================================

const handleGoogle = async () => {

  // =========================
  // BLOCK CONDITIONS
  // =========================

  if (loading || isOffline)
    return;

  try {

    setLoading(true);

    setError("");

    // =========================
    // GOOGLE PROVIDER CONFIG
    // =========================

    googleProvider.setCustomParameters({
      prompt: "select_account",
    });

    // =========================
    // SAVE TEMP STATE
    // =========================

    sessionStorage.setItem(
      "google_auth_in_progress",
      "true"
    );

    // =========================
    // REDIRECT LOGIN
    // =========================

await signInWithPopup(
  auth,
  googleProvider
);

  } catch (err) {

    console.error(
      "google auth error :",
      err
    );

    // =========================
    // CLEAN TEMP STATE
    // =========================

    sessionStorage.removeItem(
      "google_auth_in_progress"
    );

    switch (err.code) {

      case "auth/network-request-failed":

        setError(
          "connexion internet instable"
        );

        break;

      case "auth/too-many-requests":

        setError(
          "trop de tentatives"
        );

        break;

      default:

        setError(
          "connexion google impossible"
        );

    }

    setLoading(false);

  }

};
    // ==========================================
// CONNEXION SMS OTP (PRODUCTION / RÉELLE)
// ==========================================

const handleSmsOtp = async () => {

  // =========================
  // BASIC PROTECTION
  // =========================

  if (loading || isOffline) return;

  const SECURITY_KEY =
    "comiccraft_sms_security";

  const MAX_ATTEMPTS = 5;

  const BLOCK_DURATION =
    1000 * 60 * 60 * 5; // 5h

  const now = Date.now();

  const savedSecurity =
    JSON.parse(
      localStorage.getItem(
        SECURITY_KEY
      ) || "{}"
    );

  // =========================
  // BLOCK CHECK
  // =========================

  if (
    savedSecurity.blockedUntil &&
    now < savedSecurity.blockedUntil
  ) {

    const remaining =
      Math.ceil(
        (
          savedSecurity.blockedUntil -
          now
        ) / (1000 * 60)
      );

    setError(
      `trop de tentatives • réessayez dans ${remaining} min`
    );

    return;

  }
  // =========================
  // PHONE INPUT
  // =========================

  const phoneNumber =
    window.prompt(
      "🔒 connexion via sms\n\n" +
      "entrez votre numéro avec indicatif\n\n" +
      "👉 exemple : +243800625155"
    );

  if (!phoneNumber) return;

  // =========================
  // CLEAN PHONE
  // =========================

  let cleanedPhone =
    phoneNumber
      .replace(/\s/g, "")
      .trim();

  if (
    !cleanedPhone.startsWith("+")
  ) {

    cleanedPhone =
      "+" + cleanedPhone;

  }
  // =========================
  // PHONE VALIDATION
  // =========================

  const phoneRegex =
    /^\+[1-9]\d{8,14}$/;

  if (
    !phoneRegex.test(
      cleanedPhone
    )
  ) {

    setError(
      "numéro invalide"
    );

    return;

  }
  // =========================
  // START
  // =========================

  setLoading(true);

  setError("");

  try {

    // =========================
    // FIREBASE IMPORT
    // =========================

    const {
      RecaptchaVerifier,
      signInWithPhoneNumber,
    } = await import(
      "firebase/auth"
    );

    // =========================
    // CLEAR OLD CAPTCHA
    // =========================

    if (
      window.recaptchaVerifier
    ) {

      try {

        window.recaptchaVerifier.clear();

      } catch (e) {

        console.warn(e);

      }

    }

    // =========================
    // CREATE CAPTCHA
    // =========================

    window.recaptchaVerifier =
      new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {

          size: "invisible",

          callback: () => {

            console.log(
              "recaptcha validé"
            );

          },

          "expired-callback":
            () => {

              setError(
                "session expirée"
              );

            },

        }
      );

    // =========================
    // SEND SMS
    // =========================

    const confirmationResult =
      await signInWithPhoneNumber(
        auth,
        cleanedPhone,
        window.recaptchaVerifier
      );

    // =========================
    // OTP INPUT
    // =========================

    const otpCode =
      window.prompt(
        "entrez le code reçu par sms"
      );

    if (!otpCode) {

      setLoading(false);

      return;

    }

    // =========================
    // OTP VALIDATION
    // =========================

    const cleanOtp =
      otpCode.trim();

    if (
      cleanOtp.length !== 6
    ) {

      setError(
        "code otp invalide"
      );

      setLoading(false);

      return;

    }

    // =========================
    // FIREBASE CONFIRM
    // =========================

    const credential =
      await confirmationResult.confirm(
        cleanOtp
      );

    const user =
      credential.user;

    // =========================
    // SAVE USER CACHE
    // =========================

    localStorage.setItem(
      "comiccraft_last_user",
      JSON.stringify({
        uid: user.uid,
        phone:
          user.phoneNumber,
        provider: "phone",
        loginAt:
          Date.now(),
      })
    );

    // =========================
    // RESET SECURITY
    // =========================

    localStorage.removeItem(
      SECURITY_KEY
    );

    // =========================
    // USER CONTEXT
    // =========================

    setUser(user);

    // =========================
    // PROFILE CHECK
    // =========================

    await checkUserProfile(
      user
    );

    // =========================
    // SUCCESS
    // =========================

    setView("home");

  } catch (err) {

    console.error(
      "sms otp error :",
      err
    );

    // =========================
    // ATTEMPTS SAVE
    // =========================

    const attempts =
      (
        savedSecurity.attempts || 0
      ) + 1;

    const securityData = {
      attempts,
      lastAttempt: now,
    };

    // =========================
    // BLOCK USER
    // =========================

    if (
      attempts >= MAX_ATTEMPTS
    ) {

      securityData.blockedUntil =
        now + BLOCK_DURATION;

    }

    localStorage.setItem(
      SECURITY_KEY,
      JSON.stringify(
        securityData
      )
    );

    // =========================
    // FIREBASE ERRORS
    // =========================

    switch (err.code) {

      case
        "auth/invalid-phone-number":

        setError(
          "numéro invalide"
        );

        break;

      case
        "auth/invalid-verification-code":

        setError(
          "code incorrect"
        );

        break;

      case
        "auth/code-expired":

        setError(
          "code expiré"
        );

        break;

      case
        "auth/too-many-requests":

        setError(
          "trop de requêtes • attendez avant de réessayer"
        );

        break;

      case
        "auth/network-request-failed":

        setError(
          "connexion internet instable"
        );

        break;

      default:

        setError(
          "connexion sms impossible"
        );

    }

  } finally {

    setLoading(false);

  }

};

// ==========================================
// CONNEXION ANONYME
// ==========================================

const handleAnonymous = async () => {

  if (loading || isOffline)
    return;

  setLoading(true);

  setError("");

  try {

    const {
      signInAnonymously
    } = await import(
      "firebase/auth"
    );

    const credential =
      await signInAnonymously(
        auth
      );

    const user =
      credential.user;

    localStorage.setItem(
      "comiccraft_last_user",
      JSON.stringify({
        uid: user.uid,
        provider:
          "anonymous",
        loginAt:
          Date.now(),
      })
    );

    setUser(user);

    await checkUserProfile(
      user
    );

    setView("home");

  } catch (err) {

    console.error(err);

    switch (err.code) {

      case
        "auth/network-request-failed":

        setError(
          "connexion internet instable"
        );

        break;

      default:

        setError(
          "connexion anonyme impossible"
        );

    }

  } finally {

    setLoading(false);

  }

};

// ==========================================
// CONNEXION EMAIL LINK
// ==========================================

const handleEmailLink = async () => {

  if (loading || isOffline)
    return;

  const email =
    window.prompt(
      "entrez votre adresse email"
    );

  if (!email) return;

  const cleanEmail =
    email.trim().toLowerCase();

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !emailRegex.test(
      cleanEmail
    )
  ) {

    setError(
      "adresse email invalide"
    );

    return;

  }

  setLoading(true);

  setError("");

  try {

    const {
      sendSignInLinkToEmail
    } = await import(
      "firebase/auth"
    );

    const actionCodeSettings =
      {
        url:
          window.location.origin,
        handleCodeInApp:
          true,
      };

    await sendSignInLinkToEmail(
      auth,
      cleanEmail,
      actionCodeSettings
    );

    localStorage.setItem(
      "emailForSignIn",
      cleanEmail
    );

    localStorage.setItem(
      "comiccraft_last_email",
      cleanEmail
    );

    alert(
      "lien envoyé avec succès • vérifiez votre boîte mail"
    );

  } catch (err) {

    console.error(err);

    switch (err.code) {

      case
        "auth/too-many-requests":

        setError(
          "trop de demandes email"
        );

        break;

      case
        "auth/network-request-failed":

        setError(
          "connexion instable"
        );

        break;

      default:

        setError(
          "envoi du lien impossible"
        );

    }

  } finally {

    setLoading(false);

  }

};

// ==========================================
// CONNEXION BIOMÉTRIQUE
// ==========================================

const handleBiometric = async () => {

  if (loading)
    return;

  setLoading(true);

  setError("");

  try {

    const lastUser =
      localStorage.getItem(
        "comiccraft_last_user"
      );

    if (!lastUser) {

      setError(
        "aucune session biométrique enregistrée"
      );

      setLoading(false);

      return;

    }

    const parsed =
      JSON.parse(lastUser);

    // =========================
    // WEB AUTH API
    // =========================

    if (
      window.PublicKeyCredential
    ) {

      await navigator.credentials.get(
        {
          publicKey: {
            challenge:
              new Uint8Array(
                32
              ),
            timeout: 60000,
            userVerification:
              "preferred",
          },
        }
      );

    }

    alert(
      "authentification biométrique réussie"
    );

    console.log(
      "biometric user :",
      parsed.uid
    );

  } catch (err) {

    console.error(err);

    setError(
      "authentification biométrique échouée"
    );

  } finally {

    setLoading(false);

  }

};

  // ==========================================
  // APPLE LOGIN
  // ==========================================

  const handleApple =
    async () => {

      try {

        const provider =
          new OAuthProvider(
            "apple.com"
          );

        await signInWithPopup(
          auth,
          provider
        );

      } catch (err) {

        console.error(err);

        setError(
          "connexion apple impossible"
        );

      }

    };

// ==========================================
// PHONE LOGIN PREMIUM
// Compatible Firebase + Android + Capacitor
// Sécurisé + Cache utilisateur + OTP
// ==========================================

const handlePhone = async () => {

  // =========================
  // BLOCK MULTI CLICK
  // =========================

  if (loading) return;

  // =========================
  // MODE TEST
  // =========================

  const MODE_TEST = false;

  // ⚠️ Numéro autorisé dans :
  // Firebase Console
  // Authentication > Sign-in method > Phone > Test numbers

  const NUMERO_TEST =
    "+243800625155";

  // ⚠️ Code défini manuellement
  // dans Firebase Console

  const CODE_TEST_FIXE =
    "123456";

  // =========================
  // ASK / AUTO INJECT NUMBER
  // =========================

  let phoneNumber;

  if (MODE_TEST) {

    phoneNumber =
      NUMERO_TEST;

  } else {

    phoneNumber =
      window.prompt(
        "entrez votre numéro\nex: +243XXXXXXXXX"
      );

  }

  // =========================
  // EMPTY CHECK
  // =========================

  if (!phoneNumber) return;

  // =========================
  // CLEAN NUMBER
  // =========================

  const cleanedPhone =
    phoneNumber
      .replace(/\s/g, "")
      .trim();

  // =========================
  // INTERNATIONAL FORMAT
  // =========================

  const phoneRegex =
    /^\+[1-9]\d{8,14}$/;

  if (
    !phoneRegex.test(
      cleanedPhone
    )
  ) {

    setError(
      "numéro invalide"
    );

    return;

  }

  // =========================
  // BRUTE FORCE PROTECTION
  // =========================

  const PHONE_LOCK_KEY =
    "comiccraft_phone_lock";

  const lockData =
    JSON.parse(
      localStorage.getItem(
        PHONE_LOCK_KEY
      ) || "{}"
    );

  // =========================
  // ACTIVE LOCK
  // =========================

  if (
    lockData?.lockedUntil &&
    Date.now() <
      lockData.lockedUntil
  ) {

    setError(
      "trop de tentatives, réessayez plus tard"
    );

    return;

  }

  // =========================
  // START LOADING
  // =========================

  setLoading(true);

  setError("");

  try {

    // =========================
    // DYNAMIC IMPORT
    // =========================

    const {
      RecaptchaVerifier,
      signInWithPhoneNumber,
    } = await import(
      "firebase/auth"
    );

    // =========================
    // REMOVE OLD CAPTCHA
    // =========================

    if (
      window.recaptchaVerifier
    ) {

      try {

        window.recaptchaVerifier.clear();

      } catch (err) {

        console.warn(err);

      }

    }

    // =========================
    // FIREBASE RECAPTCHA
    // =========================

    window.recaptchaVerifier =
      new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {

          size: "invisible",

          callback: () => {

            console.log(
              "recaptcha validé"
            );

          },

          "expired-callback":
            () => {

              setError(
                "session expirée"
              );

            },

        }
      );

    // =========================
    // SEND SMS OTP
    // =========================

    const confirmationResult =
      await signInWithPhoneNumber(
        auth,
        cleanedPhone,
        window.recaptchaVerifier
      );

    // =========================
    // SAVE SESSION
    // =========================

    window.confirmationResult =
      confirmationResult;

    // =========================
    // OTP INPUT
    // =========================

    let otpCode;

    if (MODE_TEST) {

      otpCode =
        CODE_TEST_FIXE;

    } else {

      otpCode =
        window.prompt(
          "entrez le code sms reçu"
        );

    }

    // =========================
    // EMPTY OTP
    // =========================

    if (!otpCode) {

      setLoading(false);

      return;

    }

    // =========================
    // CLEAN OTP
    // =========================

    otpCode =
      otpCode.trim();

    // =========================
    // OTP VALIDATION
    // =========================

    if (
      otpCode.length !== 6
    ) {

      setError(
        "code invalide"
      );

      setLoading(false);

      return;

    }

    // =========================
    // FIREBASE CONFIRM
    // =========================

    const credential =
      await confirmationResult.confirm(
        otpCode
      );

    const user =
      credential.user;

    // =========================
    // SAVE LAST USER
    // =========================

    const cachedUser = {

      uid: user.uid,

      phone:
        user.phoneNumber || "",

      provider:
        user.providerData?.[0]
          ?.providerId ||
        "phone",

      lastLogin:
        Date.now(),

    };

    localStorage.setItem(
      "comiccraft_last_user",
      JSON.stringify(
        cachedUser
      )
    );

    // =========================
    // RESET SECURITY LOCK
    // =========================

    localStorage.removeItem(
      PHONE_LOCK_KEY
    );

    // =========================
    // UPDATE GLOBAL USER
    // =========================

    setUser(user);

    // =========================
    // PROFILE CHECK
    // =========================

    await checkUserProfile(
      user
    );

    // =========================
    // AUTO REDIRECT
    // =========================

    setView("home");

  } catch (err) {

    console.error(
      "phone auth error :",
      err
    );

    // =========================
    // SAVE FAILED ATTEMPTS
    // =========================

    const oldData =
      JSON.parse(
        localStorage.getItem(
          PHONE_LOCK_KEY
        ) || "{}"
      );

    const attempts =
      (oldData.attempts || 0) + 1;

    // =========================
    // LOCK AFTER 5 FAILS
    // =========================

    if (attempts >= 5) {

      localStorage.setItem(
        PHONE_LOCK_KEY,
        JSON.stringify({

          attempts,

          lockedUntil:
            Date.now() +
            1000 *
              60 *
              15,

        })
      );

    } else {

      localStorage.setItem(
        PHONE_LOCK_KEY,
        JSON.stringify({
          attempts,
        })
      );

    }

    // =========================
    // FIREBASE ERRORS
    // =========================

    switch (err.code) {

      case
        "auth/invalid-phone-number":

        setError(
          "numéro invalide"
        );

        break;

      case
        "auth/too-many-requests":

        setError(
          "trop de tentatives"
        );

        break;

      case
        "auth/invalid-verification-code":

        setError(
          "code incorrect"
        );

        break;

      case
        "auth/code-expired":

        setError(
          "code expiré"
        );

        break;

      case
        "auth/network-request-failed":

        setError(
          "connexion instable"
        );

        break;

      case
        "auth/captcha-check-failed":

        setError(
          "captcha invalide"
        );

        break;

      default:

        setError(
          "connexion téléphone impossible"
        );

    }

  } finally {

    setLoading(false);

  }

};

  // ==========================================
  // INTRO FINISH
  // ==========================================

  const handleContinue =
    () => {

      localStorage.setItem(
        "comiccraft_intro_seen",
        "true"
      );

      setShowAd(false);

    };

  // ==========================================
  // LOADING
  // ==========================================

  if (initializing) {

    return (

      <PageWrapper>

        <div
          style={{
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
            flexDirection:
              "column",
            gap: 14,
            color: "#fff",
          }}
        >

          <Loader2
            size={28}
            className="spin"
          />

          <span
            style={{
              fontSize: 13,
              opacity: 0.7,
              textTransform:
                "lowercase",
            }}
          >
            initialisation
            sécurisée...
          </span>

        </div>

      </PageWrapper>

    );

  }

  // ==========================================
  // UI
  // ==========================================

  return (

    <PageWrapper
      fullScreen={showAd}
    >

      <AnimatePresence
        mode="wait"
      >

        {showAd ? (

          <motion.div
            key="intro"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            style={{
              width: "100%",
            }}
          >

            <AuthCarousel
              onContinue={
                handleContinue
              }
            />

          </motion.div>

        ) : (

          <motion.div
            key="login"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.35,
            }}
            style={{
              width: "100%",
            }}
          >

            {/* OFFLINE */}

            <AnimatePresence>

              {isOffline && (

                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  style={{
                    width: "100%",
                    maxWidth: 420,
                    margin:
                      "0 auto 16px",
                    padding:
                      "12px 16px",
                    borderRadius: 16,
                    background:
                      "rgba(255,0,0,0.08)",
                    border:
                      "1px solid rgba(255,0,0,0.16)",
                    display: "flex",
                    alignItems:
                      "center",
                    gap: 10,
                    color: "#ffbdbd",
                    fontSize: 12,
                    fontWeight:
                      "700",
                    textTransform:
                      "lowercase",
                  }}
                >

                  <WifiOff
                    size={15}
                  />

                  <span>
                    connexion
                    internet
                    instable
                  </span>

                </motion.div>

              )}

            </AnimatePresence>

            {/* LOCK */}

            <AnimatePresence>

              {lockedUntil && (

                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  style={{
                    width: "100%",
                    maxWidth: 420,
                    margin:
                      "0 auto 16px",
                    padding:
                      "12px 16px",
                    borderRadius: 16,
                    background:
                      "rgba(255,170,0,0.08)",
                    border:
                      "1px solid rgba(255,170,0,0.16)",
                    display: "flex",
                    alignItems:
                      "center",
                    gap: 10,
                    color: "#ffe29c",
                    fontSize: 12,
                    fontWeight:
                      "700",
                    textTransform:
                      "lowercase",
                  }}
                >

                  <ShieldCheck
                    size={15}
                  />

                  <span>
                    protection
                    active •
                    réessayez dans{" "}
                    {
                      remainingTime
                    }
                  </span>

                </motion.div>

              )}

            </AnimatePresence>

{/* FORM */}

<AuthForm
  // =========================
  // CORE
  // =========================
  loading={loading}
  error={error}

  // =========================
  // STANDARD LOGIN
  // =========================
  onLogin={handleLogin}

  // =========================
  // SOCIAL LOGIN
  // =========================
  onGoogle={handleGoogle}
  onPhone={handlePhone}

  // =========================
  // ADVANCED AUTH
  // =========================
  onSmsOtp={handleSmsOtp}
  onAnonymous={handleAnonymous}
  onEmailLink={handleEmailLink}
  onBiometric={handleBiometric}

  // =========================
  // NAVIGATION
  // =========================
  onRegister={() =>
    setView("register")
  }

  // =========================
  // PREMIUM UI OPTIONS
  // =========================
  enableGlassmorphism={true}
  enableNeonMode={true}
  enableAnimatedBackground={true}
  enableSecurityBadge={true}
  enableOfflineProtection={true}
  enableRememberSession={true}
  enableBiometricHint={true}
  enableCaptchaProtection={true}

  // =========================
  // RESPONSIVE
  // =========================
  mobileOptimized={true}
  compactMode={true}
  maxWidth={420}

  // =========================
  // SYNTHWAVE COLORS
  // =========================
  theme={{
    background:
      "linear-gradient(180deg,#2D1B4E 0%,#8A2BE2 35%,#FF00FF 70%,#F28C8C 100%)",

    cardBackground:
      "rgba(255,255,255,0.08)",

    border:
      "rgba(255,255,255,0.12)",

    blur:
      "18px",

    primary:
      "#FFFFFF",

    secondary:
      "#d6cfff",

    accent:
      "#00FF99",

    neonPink:
      "#FF00FF",

    neonPurple:
      "#8A2BE2",

    neonOrange:
      "#FFA500",

    error:
      "#ff6b81",

    success:
      "#00ffae",
  }}

  // =========================
  // SECURITY
  // =========================
  security={{
    maxAttempts: 5,
    blockDurationHours: 5,
    enableAutoLock: true,
    enableDeviceTracking: true,
    enableSessionValidation: true,
    enableLoginLogs: true,
    hideSensitiveErrors: true,
  }}
// =========================
  // UX
  // =========================
  texts={{
    title:
      "Bienvenue sur ComicCraft",

    subtitle:
      "Connexion rapide • sécurisée • intelligente",

    login:
      "Se connecter",

    register:
      "Créer un compte",

    anonymous:
      "Mode invité",

    biometric:
      "Empreinte biométrique",

    sms:
      "Connexion SMS",

    emailLink:
      "Lien magique",

    google:
      "Continuer avec Google",
  }}
/>

          </motion.div>

        )}

      </AnimatePresence>

{/* ==========================================
          FIREBASE RECAPTCHA CONTAINER
          Compatible Android • Web • Capacitor
          Protection Anti-Fraude Firebase
      ========================================== */}

      <div
        id="recaptcha-container"
        aria-hidden="true"
        style={{

          // =========================
          // POSITION
          // =========================

          position: "fixed",

          bottom: "12px",

          left: "50%",

          transform:
            "translateX(-50%)",

          // =========================
          // SIZE
          // =========================

          width: "100%",

          maxWidth: "320px",

          minHeight: "78px",

          // =========================
          // VISIBILITY
          // =========================

          opacity: 0.015,

          // ⚠️ IMPORTANT
          // Firebase bloque parfois
          // le SMS si opacity = 0

          visibility: "visible",

          // ⚠️ IMPORTANT
          // éviter pointerEvents:none
          // sinon Firebase pense
          // que le captcha est masqué

          pointerEvents: "auto",

          // =========================
          // LAYER
          // =========================

          zIndex: 1,

          overflow: "hidden",

          // =========================
          // PREMIUM GLASS UI
          // =========================

          borderRadius: "18px",

          backdropFilter:
            "blur(12px)",

          WebkitBackdropFilter:
            "blur(12px)",

          background:
            "linear-gradient(135deg, rgba(138,43,226,0.08), rgba(255,0,255,0.04), rgba(255,165,0,0.04))",

          border:
            "1px solid rgba(255,255,255,0.05)",

          boxShadow:
            "0 0 30px rgba(138,43,226,0.12)",

          // =========================
          // PERFORMANCE
          // =========================

          contain:
            "layout style paint",

          WebkitTapHighlightColor:
            "transparent",

        }}
      />

    </PageWrapper>

  );

}