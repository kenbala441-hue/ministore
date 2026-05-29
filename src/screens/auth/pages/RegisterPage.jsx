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
} from "../../../firebase/index.js";

import {
  createUserWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  sendEmailVerification,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  useUserContext,
} from "../../users/userContext";

import {
  Eye,
  EyeOff,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  ArrowLeft,
} from "lucide-react";

import "./register.css";

export default function RegisterPage() {

  const navigate = useNavigate();

  const { setUser } =
    useUserContext();

  const fakeBotField =
    useRef(null);

  const nameInputRef =
    useRef(null);

  // =========================
  // STATES
  // =========================

  const [loading, setLoading] =
    useState(false);

  const [checkingGoogle,
    setCheckingGoogle] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [showConfirm,
    setShowConfirm] =
    useState(false);

  const [attempts,
    setAttempts] =
    useState(0);

  const [blockedUntil,
    setBlockedUntil] =
    useState(null);

  const [remember,
    setRemember] =
    useState(true);

  const [fieldErrors,
    setFieldErrors] =
    useState({});

  const [form, setForm] =
    useState({
      name: "",
      username: "",
      birthday: "",
      bio: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  // =========================
  // BLOCK CHECK
  // =========================

  const isBlocked =
    blockedUntil &&
    Date.now() < blockedUntil;

  // =========================
  // AUTO FOCUS
  // =========================

  useEffect(() => {

    nameInputRef.current?.focus();

  }, []);

  // =========================
  // LOAD DRAFT
  // =========================

  useEffect(() => {

    const savedDraft =
      localStorage.getItem(
        "comiccraft_register_draft"
      );

    if (savedDraft) {

      try {

        setForm(
          JSON.parse(savedDraft)
        );

      } catch {

        localStorage.removeItem(
          "comiccraft_register_draft"
        );

      }

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
  // AUTH INIT
  // =========================

  useEffect(() => {

    const init = async () => {

      try {

        await setPersistence(
          auth,
          remember
            ? browserLocalPersistence
            : browserLocalPersistence
        );

        const result =
          await getRedirectResult(
            auth
          );

        // =========================
        // GOOGLE SUCCESS
        // =========================

        if (result?.user) {

          const user =
            result.user;

          const userRef =
            doc(
              db,
              "users",
              user.uid
            );

          const snap =
            await getDoc(
              userRef
            );

          // EXISTING USER

          if (
            snap.exists() &&
            snap.data()
              ?.completedProfile
          ) {

            await setDoc(
              userRef,
              {
                lastLogin:
                  serverTimestamp(),
              },
              {
                merge: true,
              }
            );

            setUser(user);

            navigate("/home");

            return;

          }

          // NEW USER

          await setDoc(
            userRef,
            {
              uid: user.uid,

              name:
                user.displayName || "",

              username:
                user.displayName
                  ?.replace(/\s/g, "")
                  .toLowerCase() || "",

              email:
                user.email || "",

              photoURL:
                user.photoURL || "",

              provider:
                "google",

              role: "user",

              verified: true,

              acceptedTerms: false,

              completedProfile: false,

              createdAt:
                serverTimestamp(),

              lastLogin:
                serverTimestamp(),
            },
            {
              merge: true,
            }
          );

          setUser(user);

          navigate(
            "/complete-profile"
          );

        }

      } catch (err) {

        console.error(err);

        setError(
          "Erreur de connexion Google."
        );

      } finally {

        setCheckingGoogle(false);

      }

    };

    init();

  }, [navigate, setUser, remember]);

  // =========================
  // AUTO LOGOUT
  // =========================

  useEffect(() => {

    let timeout;

    const resetTimer =
      () => {

        clearTimeout(
          timeout
        );

        timeout =
          setTimeout(() => {

            auth.signOut();

          }, 1000 * 60 * 60);

      };

    window.addEventListener(
      "mousemove",
      resetTimer
    );

    window.addEventListener(
      "keydown",
      resetTimer
    );

    resetTimer();

    return () => {

      clearTimeout(timeout);

      window.removeEventListener(
        "mousemove",
        resetTimer
      );

      window.removeEventListener(
        "keydown",
        resetTimer
      );

    };

  }, []);

  // =========================
  // AGE CHECK
  // =========================

  const calculateAge =
    (birthday) => {

      if (!birthday)
        return 0;

      const birthDate =
        new Date(birthday);

      const today =
        new Date();

      let age =
        today.getFullYear() -
        birthDate.getFullYear();

      const month =
        today.getMonth() -
        birthDate.getMonth();

      if (
        month < 0 ||
        (
          month === 0 &&
          today.getDate() <
          birthDate.getDate()
        )
      ) {

        age--;

      }

      return age;

    };

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
        /[a-z]/.test(password)
      ) score++;

      if (
        /[0-9]/.test(password)
      ) score++;

      if (
        /[^A-Za-z0-9]/.test(
          password
        )
      ) score++;

      if (score <= 2)
        return "Faible";

      if (score <= 4)
        return "Moyen";

      return "Fort";

    }, [form.password]);

  // =========================
  // SANITIZE
  // =========================

  const sanitizeInput =
    (value) => {

      return value
        .replace(/[<>]/g, "")
        .trimStart();

    };

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange =
    (e) => {

      const {
        name,
        value,
      } = e.target;

      const cleanValue =
        sanitizeInput(value);

      setForm((prev) => ({
        ...prev,
        [name]:
          cleanValue,
      }));

      setFieldErrors(
        (prev) => ({
          ...prev,
          [name]: "",
        })
      );

    };

  // =========================
  // INLINE VALIDATION
  // =========================

  const validateField =
    (name, value) => {

      switch (name) {

        case "email":

          if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
              value
            )
          ) {

            return "Email invalide.";

          }

          break;

        case "username":

          if (
            value.length < 3
          ) {

            return "Pseudo trop court.";

          }

          break;

        case "password":

          if (
            value.length < 8
          ) {

            return "8 caractères minimum.";

          }

          break;

        case "confirmPassword":

          if (
            value !==
            form.password
          ) {

            return "Les mots de passe ne correspondent pas.";

          }

          break;

        default:
          return "";

      }

      return "";

    };

  const handleBlur =
    (e) => {

      const {
        name,
        value,
      } = e.target;

      const error =
        validateField(
          name,
          value
        );

      setFieldErrors(
        (prev) => ({
          ...prev,
          [name]: error,
        })
      );

    };

  // =========================
  // VALIDATION
  // =========================

  const validateForm =
    () => {

      if (
        !form.name ||
        !form.username ||
        !form.email ||
        !form.password ||
        !form.confirmPassword
      ) {

        return "Veuillez remplir tous les champs.";

      }

      const age =
        calculateAge(
          form.birthday
        );

      if (
        age > 0 &&
        age < 13
      ) {

        return "Âge minimum : 13 ans.";

      }

      if (
        !/[A-Z]/.test(
          form.password
        ) ||
        !/[a-z]/.test(
          form.password
        ) ||
        !/[0-9]/.test(
          form.password
        ) ||
        !/[^A-Za-z0-9]/.test(
          form.password
        )
      ) {

        return "Le mot de passe doit contenir majuscule, chiffre et symbole.";

      }

      if (
        form.password !==
        form.confirmPassword
      ) {

        return "Les mots de passe ne correspondent pas.";

      }

      if (
        fakeBotField.current
          ?.value
      ) {

        return "Bot détecté.";

      }

      return null;

    };

  // =========================
  // REGISTER
  // =========================

  const handleRegister =
    async () => {

      if (
        loading ||
        isBlocked
      ) return;

      setLoading(true);

      setError("");

      setSuccess("");

      try {

        const validationError =
          validateForm();

        if (
          validationError
        ) {

          setError(
            validationError
          );

          return;

        }

        const credential =
          await createUserWithEmailAndPassword(
            auth,
            form.email.trim(),
            form.password
          );

        const user =
          credential.user;

        await updateProfile(
          user,
          {
            displayName:
              form.name,
          }
        );

        await sendEmailVerification(
          user
        );

        await setDoc(
          doc(
            db,
            "users",
            user.uid
          ),
          {
            uid: user.uid,

            name:
              form.name,

            username:
              form.username
                .replace(/\s/g, "")
                .toLowerCase(),

            birthday:
              form.birthday || "",

            bio:
              form.bio || "",

            email:
              form.email.trim(),

            photoURL: "",

            provider:
              "password",

            role: "user",

            verified: false,

            acceptedTerms: false,

            completedProfile: true,

            createdAt:
              serverTimestamp(),

            lastLogin:
              serverTimestamp(),

            security: {
              bruteForceProtection: true,
            },
          }
        );

        localStorage.removeItem(
          "comiccraft_register_draft"
        );

        setUser(user);

        setSuccess(
          "Compte créé avec succès."
        );

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              700
            )
        );

        navigate("/terms");

      } catch (err) {

        console.error(err);

        const newAttempts =
          attempts + 1;

        setAttempts(
          newAttempts
        );

        if (
          newAttempts >= 5
        ) {

          setBlockedUntil(
            Date.now() +
              2 * 60 * 1000
          );

        }

        switch (
          err.code
        ) {

          case "auth/email-already-in-use":

            setError(
              "Email déjà utilisé."
            );

            break;

          case "auth/weak-password":

            setError(
              "Mot de passe faible."
            );

            break;

          case "auth/network-request-failed":

            setError(
              "Connexion internet instable."
            );

            break;

          default:

            setError(
              "Impossible de créer le compte."
            );

        }

      } finally {

        setLoading(false);

      }

    };

  // =========================
  // GOOGLE
  // =========================

  const handleGoogle =
    async () => {

      if (loading)
        return;

      try {

        setLoading(true);

        setError("");

        googleProvider
          .setCustomParameters(
            {
              prompt:
                "select_account",
            }
          );

        await signInWithRedirect(
          auth,
          googleProvider
        );

      } catch (err) {

        console.error(err);

        setError(
          "Connexion Google impossible."
        );

        setLoading(false);

      }

    };

  // =========================
  // LOADING
  // =========================

  if (checkingGoogle) {

    return (

      <div className="register-loading">

        <Loader2
          size={32}
          className="spin"
        />

      </div>

    );

  }

  // =========================
  // UI
  // =========================

  return (

    <div className="register-container">

      <div className="register-bg"></div>

      <div className="register-card">

        {/* TOPBAR */}

        <div className="register-topbar">

          <button
            className="back-btn"
            onClick={() =>
              navigate(-1)
            }
          >
            <ArrowLeft
              size={20}
            />
          </button>

        </div>

        {/* HEADER */}

        <div className="register-header">

          <div className="logo">

            <ShieldCheck
              size={22}
            />

          </div>

          <h1>
            Créer un compte
          </h1>

          <p>
            Rejoignez ComicCraft
          </p>

        </div>

        {/* HONEYPOT */}

        <input
          ref={fakeBotField}
          type="text"
          autoComplete="off"
          tabIndex={-1}
          style={{
            display: "none",
          }}
        />

        {/* NAME */}

        <label
          htmlFor="name"
        >
          Nom complet
        </label>

        <input
          ref={nameInputRef}
          id="name"
          name="name"
          value={form.name}
          onChange={
            handleChange
          }
          onBlur={
            handleBlur
          }
          placeholder="Nom complet"
          autoComplete="name"
        />

        {/* USERNAME */}

        <label
          htmlFor="username"
        >
          Pseudo
        </label>

        <input
          id="username"
          name="username"
          value={
            form.username
          }
          onChange={
            handleChange
          }
          onBlur={
            handleBlur
          }
          placeholder="Pseudo public"
          autoComplete="username"
        />

        {fieldErrors.username && (
          <span className="field-error">
            {
              fieldErrors.username
            }
          </span>
        )}

        {/* BIRTHDAY */}

        <label
          htmlFor="birthday"
        >
          Date de naissance
        </label>

        <input
          id="birthday"
          type="date"
          name="birthday"
          value={
            form.birthday
          }
          onChange={
            handleChange
          }
          autoComplete="bday"
        />

        {/* BIO */}

        <label
          htmlFor="bio"
        >
          Bio
        </label>

        <textarea
          id="bio"
          name="bio"
          value={form.bio}
          onChange={
            handleChange
          }
          placeholder="Votre bio..."
          maxLength={200}
        />

        {/* EMAIL */}

        <label
          htmlFor="email"
        >
          Adresse email
        </label>

        <input
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={
            handleChange
          }
          onBlur={
            handleBlur
          }
          placeholder="Adresse email"
          autoComplete="email"
          aria-invalid={
            !!fieldErrors.email
          }
        />

        {fieldErrors.email && (
          <span className="field-error">
            {fieldErrors.email}
          </span>
        )}

        {/* PASSWORD */}

        <label
          htmlFor="password"
        >
          Mot de passe
        </label>

        <div className="password-box">

          <input
            id="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            name="password"
            value={
              form.password
            }
            onChange={
              handleChange
            }
            onBlur={
              handleBlur
            }
            placeholder="Mot de passe"
            autoComplete="new-password"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
          >
            {showPassword
              ? (
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

        <label
          htmlFor="confirmPassword"
        >
          Confirmer le mot de passe
        </label>

        <div className="password-box">

          <input
            id="confirmPassword"
            type={
              showConfirm
                ? "text"
                : "password"
            }
            name="confirmPassword"
            value={
              form.confirmPassword
            }
            onChange={
              handleChange
            }
            onBlur={
              handleBlur
            }
            placeholder="Confirmer mot de passe"
            autoComplete="new-password"
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirm(
                !showConfirm
              )
            }
          >
            {showConfirm
              ? (
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

        {fieldErrors.confirmPassword && (
          <span className="field-error">
            {
              fieldErrors.confirmPassword
            }
          </span>
        )}

        {/* REMEMBER */}

        <label className="remember-box">

          <input
            type="checkbox"
            checked={
              remember
            }
            onChange={() =>
              setRemember(
                !remember
              )
            }
          />

          Rester connecté

        </label>

        {/* REGISTER */}

        <button
          className="register-btn"
          disabled={
            loading ||
            isBlocked
          }
          onClick={
            handleRegister
          }
        >

          {loading ? (
            <>
              <Loader2
                size={18}
                className="spin"
              />
              Création...
            </>
          ) : (
            "Créer un compte"
          )}

        </button>

        {/* GOOGLE */}

        <button
          className="google-btn"
          disabled={loading}
          onClick={
            handleGoogle
          }
        >
          Continuer avec Google
        </button>

        {/* LINKS */}

        <div
          className="forgot-link"
          onClick={() =>
            navigate(
              "/forgot-password"
            )
          }
        >
          Mot de passe oublié ?
        </div>

        <p className="login-link">

          Déjà un compte ?

          <span
            onClick={() =>
              navigate(
                "/login"
              )
            }
          >
            Se connecter
          </span>

        </p>

        {/* ERROR */}

        {error && (

          <div className="error-box">

            <AlertTriangle
              size={16}
            />

            {error}

          </div>

        )}

        {/* SUCCESS */}

        {success && (

          <div className="success-box">

            {success}

          </div>

        )}

        {/* FOOTER */}

        <div className="register-footer">

          Firebase Security • Anti Bot • Secure Auth

        </div>

      </div>

    </div>

  );

}