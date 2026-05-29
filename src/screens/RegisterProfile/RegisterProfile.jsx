// =========================
// COMPLETE PROFILE PAGE
// VERSION PRO + SÉCURISÉE
// Compatible avec TES règles Firestore
// =========================

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  auth,
  db,
  googleProvider,
} from "../auth";

import {
  useUserContext,
} from "../users/userContext";

import { signInWithPopup, getRedirectResult, updateProfile } from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { updatePassword } from "firebase/auth";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  ArrowLeft,
} from "lucide-react";

export default function CompleteProfilePage() {

  const navigate =
    useNavigate();

  const { setUser } =
    useUserContext();

  const fakeBotField =
    useRef(null);

  // =========================
  // STATES
  // =========================

  const [loading, setLoading] =
    useState(false);

  const [checkingAuth,
    setCheckingAuth] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [googleUser,
    setGoogleUser] =
    useState(null);

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [showConfirm,
    setShowConfirm] =
    useState(false);

  // =========================
// FORM STATE
// VERSION ANDROID FRIENDLY
// =========================

const [form, setForm] =
  useState({
    name: "",
    username: "",

    // =========================
    // DATE FIELDS
    // =========================

    day: "",
    month: "",
    year: "",

    // =========================
    // PROFILE
    // =========================

    bio: "",

    // =========================
    // SECURITY
    // =========================

    password: "",
    confirmPassword: "",
  });

  // =========================
  // LOAD DRAFT
  // =========================

  useEffect(() => {

    try {

      const savedDraft =
        localStorage.getItem(
          "comiccraft_register_draft"
        );

      if (savedDraft) {

        setForm(
          JSON.parse(savedDraft)
        );

      }

    } catch {

      localStorage.removeItem(
        "comiccraft_register_draft"
      );

    }

  }, []);

  // =========================
  // SAVE DRAFT
  // =========================

  useEffect(() => {

    localStorage.setItem(
      "comiccraft_register_draft",
      JSON.stringify(form)
    );

  }, [form]);

  // =========================
  // PASSWORD STRENGTH
  // =========================

  const passwordStrength =
    useMemo(() => {

      const password =
        form.password;

      let score = 0;

      if (
        password.length >= 8
      ) score++;

      if (
        /[A-Z]/.test(password)
      ) score++;

      if (
        /[0-9]/.test(password)
      ) score++;

      if (
        /[^A-Za-z0-9]/.test(password)
      ) score++;

      if (score <= 1)
        return "Faible";

      if (score <= 3)
        return "Moyen";

      return "Fort";

    }, [form.password]);

  // =========================
  // GOOGLE REDIRECT
  // =========================

  useEffect(() => {

    let mounted = true;

    const checkRedirect =
      async () => {

        try {

          const result =
            await getRedirectResult(auth);

          // =========================
          // NO RESULT
          // =========================

          if (!result?.user) {

            if (mounted) {

              setCheckingAuth(false);

            }

            return;

          }

          const user =
            result.user;

          const userRef =
            doc(
              db,
              "users",
              user.uid
            );

          const snap =
            await getDoc(userRef);

          // =========================
          // EXISTING USER
          // =========================

          if (snap.exists()) {

            const userData =
              snap.data();

            // =========================
            // PROFILE COMPLETED
            // =========================

            if (
              userData?.completedProfile === true &&
              userData?.acceptedTerms === true
            ) {

              navigate("/home", {
                replace: true,
              });

              return;

            }

            if (mounted) {

              setGoogleUser(user);

              setUser(user);

              setForm(prev => ({
                ...prev,

                name:
                  userData?.displayName ||
                  user.displayName ||
                  "",

                username:
                  userData?.username ||
                  "",

                birthday:
                  userData?.birthday ||
                  "",

                bio:
                  userData?.bio ||
                  "",
              }));

            }

          } else {

            // =========================
            // IMPORTANT
            // PAS DE CREATE USER DOC
            // ici pour respecter
            // TES règles firestore
            // =========================

            const safeUsername =
              (
                user.displayName ||
                "user"
              )
                .replace(/\s/g, "")
                .toLowerCase()
                .slice(0, 20);

            if (mounted) {

              setGoogleUser(user);

              setUser(user);

              setForm(prev => ({
                ...prev,

                name:
                  user.displayName || "",

                username:
                  safeUsername,
              }));

            }

          }

        } catch (err) {

          console.error(
            "Redirect Error:",
            err
          );

          if (mounted) {

            setError(
              "Connexion Google impossible."
            );

          }

        } finally {

          if (mounted) {

            setCheckingAuth(false);

          }

        }

      };

    checkRedirect();

    return () => {

      mounted = false;

    };

  }, [
    navigate,
    setUser,
  ]);

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange =
    (e) => {

      const {
        name,
        value,
      } = e.target;

      setForm(prev => ({
        ...prev,
        [name]: value,
      }));

    };
// =========================
// AGE + DATE VALIDATION
// ANDROID FRIENDLY
// =========================

const calculateAge =
  (
    day,
    month,
    year
  ) => {

    const today =
      new Date();

    const birthDate =
      new Date(
        year,
        month - 1,
        day
      );

    let age =
      today.getFullYear() -
      birthDate.getFullYear();

    const monthDiff =
      today.getMonth() -
      birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (
        monthDiff === 0 &&
        today.getDate() <
          birthDate.getDate()
      )
    ) {

      age--;

    }

    return age;

  };

// =========================
// VALIDATION
// STRICT VERSION
// =========================

const validateForm =
  () => {

    // =========================
    // REQUIRED FIELDS
    // =========================

    if (
      !form.name.trim() ||
      !form.username.trim() ||
      !form.day ||
      !form.month ||
      !form.year ||
      !form.password
    ) {

      return (
        "Veuillez remplir tous les champs."
      );

    }

    // =========================
    // CLEAN VALUES
    // =========================

    const d =
      parseInt(
        form.day,
        10
      );

    const m =
      parseInt(
        form.month,
        10
      );

    const y =
      parseInt(
        form.year,
        10
      );

    // =========================
    // BASIC DATE CHECK
    // =========================

    if (
      isNaN(d) ||
      d < 1 ||
      d > 31 ||
      isNaN(m) ||
      m < 1 ||
      m > 12 ||
      isNaN(y)
    ) {

      return (
        "Veuillez entrer une date valide."
      );

    }

    // =========================
    // YEAR SECURITY
    // =========================

    const currentYear =
      new Date()
        .getFullYear();

    if (
      y < 1940 ||
      y > currentYear
    ) {

      return (
        "Année invalide."
      );

    }

    // =========================
    // REAL DATE CHECK
    // =========================

    const birthDate =
      new Date(
        y,
        m - 1,
        d
      );

    if (
      birthDate.getDate() !== d ||
      birthDate.getMonth() !==
        m - 1 ||
      birthDate.getFullYear() !== y
    ) {

      return (
        "Date de naissance invalide."
      );

    }

    // =========================
    // AGE CHECK
    // =========================

    const age =
      calculateAge(
        d,
        m,
        y
      );

    // =========================
    // MIN AGE
    // =========================

    if (age < 16) {

      return (
        "Âge minimum requis : 16 ans."
      );

    }

    // =========================
    // MAX AGE
    // =========================

    if (age > 80) {

      return (
        "Âge maximum autorisé : 80 ans."
      );

    }

    // =========================
    // USERNAME SECURITY
    // =========================

    if (
      form.username.length < 3
    ) {

      return (
        "Pseudo trop court."
      );

    }

    if (
      !/^[a-zA-Z0-9_]+$/.test(
        form.username
      )
    ) {

      return (
        "Pseudo invalide."
      );

    }

    // =========================
    // PASSWORD SECURITY
    // =========================

    if (
      form.password.length < 8
    ) {

      return (
        "Mot de passe minimum : 8 caractères."
      );

    }

    // =========================
    // PASSWORD MATCH
    // =========================

    if (
      form.password !==
      form.confirmPassword
    ) {

      return (
        "Les mots de passe ne correspondent pas."
      );

    }

    // =========================
    // BOT DETECTION
    // =========================

    if (
      fakeBotField.current
        ?.value
    ) {

      return (
        "Bot détecté."
      );

    }

    return null;

  };


// ==========================================
// FINALIZE
// VERSION ULTRA COMPATIBLE FIRESTORE RULES
// STRICT + SAFE + CLEAN
// ==========================================

const handleFinalize = async (e) => {

  if (e) e.preventDefault();

  // =========================
  // SESSION CHECK
  // =========================

  const currentUser =
    auth.currentUser;

  if (!currentUser) {

    setError(
      "Session introuvable. Veuillez vous reconnecter."
    );

    return;

  }

  // =========================
  // VALIDATION
  // =========================

  const validationError =
    validateForm();

  if (validationError) {

    setError(validationError);

    return;

  }

  try {

    setLoading(true);

    setError("");

    setSuccess("");

    // =========================
    // DATE FORMAT
    // YYYY-MM-DD
    // =========================

    const birthDateString =
      `${form.year}-${String(form.month).padStart(2, "0")}-${String(form.day).padStart(2, "0")}`;

    // =========================
    // USER REF
    // =========================

    const userRef =
      doc(
        db,
        "users",
        currentUser.uid
      );

    // =========================
    // CHECK EXISTING ACCOUNT
    // =========================

    const existingUser =
      await getDoc(userRef);

    // =========================
    // SAFE USERNAME
    // =========================

    const cleanUsername =
      form.username
        .trim()
        .replace(/\s/g, "")
        .toLowerCase();

    // =========================
// PROFILE DATA
// STRICT RULES COMPATIBLE
// =========================

const profileData = {

  // 🔐 REQUIRED BY RULES
  uid:
    currentUser.uid,

  // 🔐 REQUIRED FIELDS
  name:
    form.name
      .trim(),

  username:
    cleanUsername,

  birthday:
    birthDateString,

  // 🔐 ROLE LOCKED
  role:
    "user",

  // =========================
  // OPTIONAL SAFE DATA
  // =========================

  bio:
    form.bio
      ? form.bio.trim()
      : "",

  email:
    currentUser.email || "",

  photoURL:
    currentUser.photoURL || "",

  provider:
    currentUser.providerData?.[0]
      ?.providerId || "google.com",

  verified:
    currentUser.emailVerified || false,

  acceptedTerms:
    false,

  completedProfile:
    true,

  // =========================
  // TIMESTAMPS
  // =========================

  createdAt:
    serverTimestamp(),

  lastLogin:
    serverTimestamp(),

};

// =========================
// CREATE ACCOUNT
// STRICT CREATE
// =========================

if (!existingUser.exists()) {

  await setDoc(
    userRef,
    profileData
  );

} else {

  // =========================
  // SAFE UPDATE
  // ROLE + UID NEVER CHANGE
  // =========================

  await setDoc(
    userRef,
    {

      // 🔐 REQUIRED
      uid:
        currentUser.uid,

      role:
        "user",

      // 🔐 PROFILE
      name:
        profileData.name,

      username:
        profileData.username,

      birthday:
        profileData.birthday,

      bio:
        profileData.bio,

      // 🔐 SAFE META
      photoURL:
        profileData.photoURL,

      verified:
        profileData.verified,

      completedProfile:
        true,

      lastLogin:
        serverTimestamp(),

    },
    {
      merge: true,
    }
  );

}

    // =========================
    // CREATE ACCOUNT
    // STRICT CREATE
    // =========================

    if (!existingUser.exists()) {

      await setDoc(
        userRef,
        profileData
      );

    } else {

      // =========================
      // SAFE UPDATE
      // ROLE NEVER CHANGES
      // UID NEVER CHANGES
      // =========================

      await setDoc(
        userRef,
        {
          displayName:
            profileData.displayName,

          username:
            profileData.username,

          bio:
            profileData.bio,

          birthday:
            profileData.birthday,

          photoURL:
            profileData.photoURL,

          verified:
            profileData.verified,

          completedProfile:
            true,

          lastLogin:
            serverTimestamp(),
        },
        {
          merge: true,
        }
      );

    }

    // =========================
    // UPDATE AUTH PROFILE
    // =========================

    await updateProfile(
      currentUser,
      {
        displayName:
          form.name.trim(),
      }
    );

    // =========================
    // UPDATE PASSWORD
    // =========================

    if (
      form.password &&
      form.password.length >= 8
    ) {

      await updatePassword(
        currentUser,
        form.password
      );

    }

    // =========================
    // CLEAN LOCAL STORAGE
    // =========================

    localStorage.removeItem(
      "comiccraft_register_draft"
    );

    // =========================
    // SUCCESS
    // =========================

    setSuccess(
      "Profil enregistré avec succès !"
    );

    console.log(
      "Compte ComicCraft sécurisé créé."
    );

    // =========================
    // REDIRECT
    // =========================

    navigate("/terms");

  } catch (finalizeError) {

    console.error(
      "Finalize Error:",
      finalizeError
    );

    // =========================
    // FIREBASE ERRORS
    // =========================

    switch (finalizeError.code) {

      case "permission-denied":

        setError(
          "Accès refusé par les règles Firestore."
        );

        break;

      case "auth/requires-recent-login":

        setError(
          "Reconnectez-vous avant de modifier le mot de passe."
        );

        break;

      case "auth/weak-password":

        setError(
          "Mot de passe trop faible."
        );

        break;

      case "already-exists":

        setError(
          "Compte déjà existant."
        );

        break;

      case "unavailable":

        setError(
          "Serveur Firebase indisponible."
        );

        break;

      case "failed-precondition":

        setError(
          "Précondition Firebase invalide."
        );

        break;

      default:

        setError(
          finalizeError.message ||
          "Impossible de finaliser le compte."
        );

    }

  } finally {

    setLoading(false);

  }

};

// =========================
// GOOGLE LOGIN
// POPUP VERSION • STABLE
// =========================

const handleGoogle =
  async () => {

    // =========================
    // BLOCK MULTIPLE CLICKS
    // =========================

    if (loading) return;

    try {

      setLoading(true);

      setError("");

      // =========================
      // GOOGLE PROVIDER CONFIG
      // =========================

      googleProvider
        .setCustomParameters({
          prompt:
            "select_account",
        });

      // =========================
      // GOOGLE POPUP LOGIN
      // =========================

      const result =
        await signInWithPopup(
          auth,
          googleProvider
        );

      // =========================
      // SUCCESS
      // =========================

      if (result?.user) {

        const user =
          result.user;

        setGoogleUser(user);

        setUser(user);

      }

    } catch (err) {

      console.error(
        "Google Error:",
        err
      );

      // =========================
      // FIREBASE ERRORS
      // =========================

      switch (err.code) {

        case
          "auth/popup-closed-by-user":

          setError(
            "Popup Google fermée."
          );

          break;

        case
          "auth/cancelled-popup-request":

          setError(
            "Connexion annulée."
          );

          break;

        case
          "auth/popup-blocked":

          setError(
            "Popup bloquée par le navigateur."
          );

          break;

        case
          "auth/network-request-failed":

          setError(
            "Connexion internet instable."
          );

          break;

        case
          "auth/too-many-requests":

          setError(
            "Trop de tentatives."
          );

          break;

        default:

          setError(
            "Connexion Google impossible."
          );

      }

    } finally {

      setLoading(false);

    }

  };

// =========================
// LOADING
// =========================

if (checkingAuth) {

  return (

    <div className="register-loading">

      <Loader2
        size={34}
        className="spin"
      />

    </div>

  );

}

return (

  <div className="register-container">

    <div className="register-bg" />

    <div className="register-card">

        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <div className="register-topbar">

          <button
            type="button"
            className="back-btn"
            onClick={() =>
              navigate("/login")
            }
          >

            <ArrowLeft
              size={20}
            />

          </button>

          <div className="register-header">

            <div className="logo">

              <ShieldCheck
                size={24}
              />

            </div>

            <h1>
              Finaliser votre profil
            </h1>

            <p>
              Complétez votre compte ComicCraft
            </p>

          </div>

        </div>

        {/* ========================= */}
        {/* GOOGLE LOGIN */}
        {/* ========================= */}

        {!googleUser && (

          <button
            className="google-btn"
            disabled={loading}
            onClick={
              handleGoogle
            }
          >

            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="spin"
                />
                Connexion...
              </>
            ) : (
              "Continuer avec Google"
            )}

          </button>

        )}

        {/* ========================= */}
        {/* COMPLETE FORM */}
        {/* ========================= */}

        {googleUser && (

          <>

            <input
              ref={
                fakeBotField
              }
              type="text"
              autoComplete="off"
              tabIndex="-1"
              style={{
                display:
                  "none",
              }}
            />

            <input
              type="text"
              name="name"
              placeholder="Nom complet"
              value={form.name}
              onChange={
                handleChange
              }
            />

            <input
              type="text"
              name="username"
              placeholder="Pseudo public"
              value={
                form.username
              }
              onChange={
                handleChange
              }
            />

{/* =========================
   DATE OF BIRTH GOOGLE STYLE • MOBILE FRIENDLY
========================= */}

<div className="birthday-group">

  <input
    type="number"
    name="day"
    placeholder="Jour"
    min="1"
    max="31"
    inputMode="numeric"
    value={form.day}
    onChange={handleChange}
    className="birthday-input small"
  />

  <input
    type="number"
    name="month"
    placeholder="Mois"
    min="1"
    max="12"
    inputMode="numeric"
    value={form.month}
    onChange={handleChange}
    className="birthday-input small"
  />

  <input
    type="number"
    name="year"
    placeholder="Année"
    min={
      new Date()
        .getFullYear() - 80
    }
    max={
      new Date()
        .getFullYear() - 16
    }
    inputMode="numeric"
    value={form.year}
    onChange={handleChange}
    className="birthday-input large"
  />
   </div>
            <textarea
              name="bio"
              placeholder="Votre bio..."
              value={
                form.bio
              }
              onChange={
                handleChange
              }
              maxLength={200}
            />

            {/* PASSWORD */}

            <div className="password-box">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Créer un mot de passe"
                value={
                  form.password
                }
                onChange={
                  handleChange
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    prev => !prev
                  )
                }
              >

                {showPassword ? (
                  <EyeOff
                    size={18}
                  />
                ) : (
                  <Eye
                    size={18}
                  />
                )}

              </button>

            </div>

            <div
              className={`strength ${passwordStrength.toLowerCase()}`}
            >

              Force :
              {" "}
              {passwordStrength}

            </div>

            {/* CONFIRM */}

            <div className="password-box">

              <input
                type={
                  showConfirm
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirmer le mot de passe"
                value={
                  form.confirmPassword
                }
                onChange={
                  handleChange
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirm(
                    prev => !prev
                  )
                }
              >

                {showConfirm ? (
                  <EyeOff
                    size={18}
                  />
                ) : (
                  <Eye
                    size={18}
                  />
                )}

              </button>

            </div>

            {/* BUTTON */}

            <button
              className="register-btn"
              disabled={loading}
              onClick={
                handleFinalize
              }
            >

              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="spin"
                  />
                  Finalisation...
                </>
              ) : (
                "Créer mon compte"
              )}

            </button>

          </>

        )}

        {/* ========================= */}
        {/* ERROR */}
        {/* ========================= */}

        {error && (

          <div className="error-box">

            <AlertTriangle
              size={16}
            />

            <span>
              {error}
            </span>

          </div>

        )}

        {/* ========================= */}
        {/* SUCCESS */}
        {/* ========================= */}

        {success && (

          <div className="success-box">

            {success}

          </div>

        )}

      </div>

    </div>

  );

}