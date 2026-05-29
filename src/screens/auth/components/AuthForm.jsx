// ==========================================
// AuthForm.jsx
// MOBILE + PC OPTIMIZED
// ==========================================

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Chrome,
  Smartphone,
  ChevronDown,
  Loader2,
  AlertTriangle,
  UserPlus,
  Phone,
  Apple,
} from "lucide-react";

const LOCK_KEY =
  "comiccraft_login_lock";

const MAX_ATTEMPTS = 5;

const LOCK_DURATION =
  1000 * 60 * 60 * 5;

export default function AuthForm({

  // =========================
  // AUTH METHODS
  // =========================

  onLogin,
  onGoogle,
  onApple,
  onPhone,

  // 🆕 NOUVELLES MÉTHODES

  onSmsOtp,
  onEmailLink,
  onBiometric,
  onAnonymous,

  // =========================
  // NAVIGATION
  // =========================

  onRegister,

  // =========================
  // UI STATE
  // =========================

  loading = false,
  error = "",

  // =========================
  // OPTIONAL UI TEXTS
  // =========================

  texts = {},

}) {

  // ==========================================
  // STATES
  // ==========================================

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showMore, setShowMore] =
    useState(false);

  const [attempts, setAttempts] =
    useState(0);

  const [lockedUntil, setLockedUntil] =
    useState(null);

  const [remainingTime, setRemainingTime] =
    useState("");

  const [isMobile, setIsMobile] =
    useState(
      window.innerWidth <= 768
    );

  // ==========================================
  // RESIZE
  // ==========================================

  useEffect(() => {

    const resize = () => {

      setIsMobile(
        window.innerWidth <= 768
      );

    };

    window.addEventListener(
      "resize",
      resize
    );

    return () =>
      window.removeEventListener(
        "resize",
        resize
      );

  }, []);

  // ==========================================
  // LOAD LOCK
  // ==========================================

  useEffect(() => {

    const saved =
      localStorage.getItem(
        LOCK_KEY
      );

    if (!saved) return;

    try {

      const parsed =
        JSON.parse(saved);

      if (
        parsed?.lockedUntil &&
        Date.now() <
          parsed.lockedUntil
      ) {

        setAttempts(
          parsed.attempts || 0
        );

        setLockedUntil(
          parsed.lockedUntil
        );

      } else {

        localStorage.removeItem(
          LOCK_KEY
        );

      }

    } catch {

      localStorage.removeItem(
        LOCK_KEY
      );

    }

  }, []);

  // ==========================================
  // TIMER
  // ==========================================

  useEffect(() => {

    if (!lockedUntil) return;

    const interval =
      setInterval(() => {

        const diff =
          lockedUntil - Date.now();

        if (diff <= 0) {

          setLockedUntil(null);

          setAttempts(0);

          setRemainingTime("");

          localStorage.removeItem(
            LOCK_KEY
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
  // LOCKED
  // ==========================================

  const isLocked =
    useMemo(() => {

      return (
        lockedUntil &&
        Date.now() < lockedUntil
      );

    }, [lockedUntil]);

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    if (
      loading ||
      isLocked
    ) return;

    try {

      const result =
        await onLogin?.(
          email,
          password
        );

      if (
        result?.success === false
      ) {

        const nextAttempts =
          attempts + 1;

        setAttempts(
          nextAttempts
        );

        if (
          nextAttempts >=
          MAX_ATTEMPTS
        ) {

          const lockTime =
            Date.now() +
            LOCK_DURATION;

          setLockedUntil(
            lockTime
          );

          localStorage.setItem(
            LOCK_KEY,
            JSON.stringify({
              attempts:
                nextAttempts,
              lockedUntil:
                lockTime,
            })
          );

        }

      } else {

        setAttempts(0);

        localStorage.removeItem(
          LOCK_KEY
        );

      }

    } catch (err) {

      console.error(err);

    }

  };

  return (

    <div style={styles.wrapper}>

      {/* BACKGROUND */}

      <div style={styles.glow1} />
      <div style={styles.glow2} />

      {/* CARD */}

      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        style={{
          ...styles.card,

          flexDirection:
            isMobile
              ? "column"
              : "row",
        }}
      >

        {/* LEFT */}

        <div style={styles.left}>

          {/* BRAND */}

          <div style={styles.brand}>

            <div style={styles.logo} />

            <span>
              comiccraft
            </span>

          </div>

          {/* HEADER */}

          <div style={styles.header}>

            <h1
              style={{
                ...styles.title,

                fontSize:
                  isMobile
                    ? "32px"
                    : "62px",

                lineHeight:
                  isMobile
                    ? 0.95
                    : 0.88,
              }}
            >

              connexion
              premium

            </h1>

            <p
              style={{
                ...styles.subtitle,

                fontSize:
                  isMobile
                    ? "11px"
                    : "14px",
              }}
            >

              rapide, stable,
              sécurisé et
              optimisé android
              / capacitor

            </p>

          </div>

          {/* SECURITY */}

          <div
            style={{
              ...styles.securityBox,

              fontSize:
                isMobile
                  ? "10px"
                  : "12px",
            }}
          >

            <ShieldCheck
              size={
                isMobile
                  ? 12
                  : 15
              }
            />

            <span>
              protection active
            </span>

          </div>

          {/* LOCK */}

          <AnimatePresence>

            {isLocked && (

              <motion.div
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                style={styles.lockedBox}
              >

                <AlertTriangle
                  size={14}
                />

                <span>
                  accès bloqué
                  pendant{" "}
                  {
                    remainingTime
                  }
                </span>

              </motion.div>

            )}

          </AnimatePresence>

          {/* FORM */}

          <form
            onSubmit={
              handleSubmit
            }
            style={styles.form}
          >

            {/* EMAIL */}

            <div
              style={styles.inputBox}
            >

              <Mail
                size={
                  isMobile
                    ? 15
                    : 18
                }
              />

              <input
                type="email"
                placeholder="adresse email"
                value={email}
                disabled={isLocked}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                style={{
                  ...styles.input,

                  fontSize:
                    isMobile
                      ? "12px"
                      : "14px",
                }}
              />

            </div>

            {/* PASSWORD */}

            <div
              style={styles.inputBox}
            >

              <Lock
                size={
                  isMobile
                    ? 15
                    : 18
                }
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="mot de passe"
                value={password}
                disabled={isLocked}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                style={{
                  ...styles.input,

                  fontSize:
                    isMobile
                      ? "12px"
                      : "14px",
                }}
              />

              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >

                {showPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}

              </button>

            </div>

            {/* ERROR */}

            {error && (

              <div
                style={styles.errorBox}
              >

                {error}

              </div>

            )}

{/* LOGIN */}

<motion.button
  whileTap={{
    scale: 0.98,
  }}
  type="submit"
  disabled={
    loading ||
    isLocked
  }
  style={{
    ...styles.submitBtn,

    height:
      isMobile
        ? 52
        : 58,

    fontSize:
      isMobile
        ? "13px"
        : "15px",

    opacity:
      loading || isLocked
        ? 0.7
        : 1,

    pointerEvents:
      loading || isLocked
        ? "none"
        : "auto",
  }}
>

  {loading ? (

    <Loader2
      size={18}
      className="spin"
    />

  ) : (
    "se connecter"
  )}

</motion.button>

</form>

{/* SOCIALS */}

<div
  style={{
    ...styles.socials,

    gridTemplateColumns:
      isMobile
        ? "1fr"
        : "repeat(3,1fr)",
  }}
>

  {/* GOOGLE */}

  <button
    type="button"
    disabled={loading}
    onClick={async (e) => {

      e.preventDefault();

      if (
        loading ||
        typeof onGoogle !==
          "function"
      ) return;

      try {

        await onGoogle();

      } catch (err) {

        console.error(
          "google login error :",
          err
        );

      }

    }}
    style={{
      ...styles.socialBtn,

      opacity:
        loading ? 0.6 : 1,
    }}
  >

    <Chrome size={16} />

    <span>
      google
    </span>

  </button>

  {/* APPLE */}

  <button
    type="button"
    disabled={loading}
    onClick={async (e) => {

      e.preventDefault();

      if (
        loading ||
        typeof onApple !==
          "function"
      ) return;

      try {

        await onApple();

      } catch (err) {

        console.error(
          "apple login error :",
          err
        );

      }

    }}
    style={{
      ...styles.socialBtn,

      opacity:
        loading ? 0.6 : 1,
    }}
  >

    <Apple size={16} />

    <span>
      apple
    </span>

  </button>

  {/* PHONE */}

  <button
    type="button"
    disabled={loading}
    onClick={async (e) => {

      e.preventDefault();

      if (
        loading ||
        typeof onPhone !==
          "function"
      ) return;

      try {

        await onPhone();

      } catch (err) {

        console.error(
          "phone login error :",
          err
        );

      }

    }}
    style={{
      ...styles.socialBtn,

      opacity:
        loading ? 0.6 : 1,
    }}
  >

    <Phone size={16} />

    <span>
      téléphone
    </span>

  </button>

</div>

{/* MORE */}

<button
  type="button"
  onClick={() =>
    setShowMore(
      !showMore
    )
  }
  style={{
    ...styles.moreBtn,

    height:
      isMobile
        ? 50
        : 56,
  }}
>

  <div
    style={{
      display: "flex",
      alignItems:
        "center",
      gap: 8,
    }}
  >

    <Smartphone
      size={15}
    />

    <span>
      autres options
    </span>

  </div>

  <ChevronDown
    size={15}
  />

</button>

          {/* OPTIONS */}

          <AnimatePresence>

{showMore && (

  <motion.div
    initial={{
      opacity: 0,
      height: 0,
      y: -8,
    }}
    animate={{
      opacity: 1,
      height: "auto",
      y: 0,
    }}
    exit={{
      opacity: 0,
      height: 0,
      y: -8,
    }}
    transition={{
      duration: 0.25,
    }}
    style={
      styles.moreOptions
    }
  >

    {/* =========================
       SMS OTP
    ========================= */}

    <button
      type="button"
      disabled={loading}
      onClick={onSmsOtp}
      style={{
        ...styles.optionBtn,

        background:
          "linear-gradient(135deg, rgba(138,43,226,0.22), rgba(255,0,255,0.12))",

        border:
          "1px solid rgba(255,255,255,0.08)",

        boxShadow:
          "0 0 18px rgba(138,43,226,0.18)",
      }}
    >

      <span style={styles.optionIcon}>
        📱
      </span>

      <div
        style={
          styles.optionContent
        }
      >

        <span
          style={
            styles.optionTitle
          }
        >
          sms otp
        </span>

        <span
          style={
            styles.optionSubtitle
          }
        >
          vérification sécurisée par code
        </span>

      </div>

    </button>

    {/* =========================
       EMAIL LINK
    ========================= */}

    <button
      type="button"
      disabled={loading}
      onClick={onEmailLink}
      style={{
        ...styles.optionBtn,

        background:
          "linear-gradient(135deg, rgba(255,0,140,0.16), rgba(255,165,0,0.10))",

        border:
          "1px solid rgba(255,255,255,0.08)",

        boxShadow:
          "0 0 18px rgba(255,0,140,0.12)",
      }}
    >

      <span style={styles.optionIcon}>
        ✉️
      </span>

      <div
        style={
          styles.optionContent
        }
      >

        <span
          style={
            styles.optionTitle
          }
        >
          email link
        </span>

        <span
          style={
            styles.optionSubtitle
          }
        >
          connexion magique sans mot de passe
        </span>

      </div>

    </button>

    {/* =========================
       BIOMETRIC
    ========================= */}

    <button
      type="button"
      disabled={loading}
      onClick={onBiometric}
      style={{
        ...styles.optionBtn,

        background:
          "linear-gradient(135deg, rgba(0,255,180,0.12), rgba(0,150,255,0.10))",

        border:
          "1px solid rgba(255,255,255,0.08)",

        boxShadow:
          "0 0 18px rgba(0,255,180,0.10)",
      }}
    >

      <span style={styles.optionIcon}>
        🔐
      </span>

      <div
        style={
          styles.optionContent
        }
      >

        <span
          style={
            styles.optionTitle
          }
        >
          biométrique
        </span>

        <span
          style={
            styles.optionSubtitle
          }
        >
          empreinte ou reconnaissance faciale
        </span>

      </div>

    </button>

    {/* =========================
       ANONYMOUS
    ========================= */}

    <button
      type="button"
      disabled={loading}
      onClick={onAnonymous}
      style={{
        ...styles.optionBtn,

        background:
          "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(138,43,226,0.10))",

        border:
          "1px solid rgba(255,255,255,0.08)",

        boxShadow:
          "0 0 18px rgba(255,255,255,0.06)",
      }}
    >

      <span style={styles.optionIcon}>
        👤
      </span>

      <div
        style={
          styles.optionContent
        }
      >

        <span
          style={
            styles.optionTitle
          }
        >
          mode invité
        </span>

        <span
          style={
            styles.optionSubtitle
          }
        >
          accès rapide sans création de compte
        </span>

      </div>

    </button>

  </motion.div>

)}

</AnimatePresence>

          {/* REGISTER */}

          <button
            type="button"
            onClick={onRegister}
            style={styles.registerBtn}
          >

            <UserPlus
              size={15}
            />

            <span>
              créer mon compte
            </span>

          </button>

        </div>

        {/* RIGHT */}

        {!isMobile && (

          <div style={styles.right}>

            <div
              style={styles.preview}
            >

              <div
                style={
                  styles.previewOverlay
                }
              />

              <div
                style={
                  styles.previewContent
                }
              >

                <span
                  style={
                    styles.previewBadge
                  }
                >
                  comiccraft secure
                </span>

                <h2
                  style={
                    styles.previewTitle
                  }
                >
                  immersive
                </h2>

                <p
                  style={
                    styles.previewText
                  }
                >
                  expérience fluide
                  web + android
                </p>

              </div>

            </div>

          </div>

        )}

      </motion.div>

    </div>
  );
}
// ==========================================
// STYLES
// ==========================================

const styles = {

  wrapper: {
    width: "100%",
    minHeight: "100vh",
    background:
      "#050816",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "14px",
    overflowX: "hidden",
    position: "relative",
  },

  glow1: {
    position: "absolute",
    top: -200,
    left: -200,
    width: 350,
    height: 350,
    borderRadius: "50%",
    background:
      "rgba(0,255,255,0.12)",
    filter: "blur(100px)",
  },

  glow2: {
    position: "absolute",
    bottom: -200,
    right: -200,
    width: 350,
    height: 350,
    borderRadius: "50%",
    background:
      "rgba(123,97,255,0.18)",
    filter: "blur(100px)",
  },

  card: {
    width: "100%",
    maxWidth: 1080,
    minHeight: 620,
    borderRadius: 28,
    overflow: "hidden",
    display: "flex",
    background:
      "rgba(10,14,25,0.9)",
    border:
      "1px solid rgba(255,255,255,0.06)",
    backdropFilter:
      "blur(24px)",
    boxShadow:
      "0 0 80px rgba(0,0,0,0.45)",
    zIndex: 5,
  },

  left: {
    flex: 1,
    padding: "22px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  right: {
    flex: 1,
    padding: 14,
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
    textTransform:
      "lowercase",
    marginBottom: 24,
  },

  logo: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    background:
      "linear-gradient(135deg,#00d9ff,#6f6bff)",
    boxShadow:
      "0 0 20px rgba(0,217,255,0.7)",
  },

  header: {
    marginBottom: 16,
  },

  title: {
    margin: 0,
    color: "#fff",
    fontWeight: "900",
    textTransform:
      "lowercase",
    letterSpacing: "-2px",
  },

  subtitle: {
    marginTop: 10,
    color:
      "rgba(255,255,255,0.65)",
    lineHeight: 1.6,
    textTransform:
      "lowercase",
  },

  securityBox: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    width: "fit-content",
    padding: "8px 12px",
    borderRadius: 999,
    background:
      "rgba(255,255,255,0.05)",
    border:
      "1px solid rgba(255,255,255,0.05)",
    color: "#dffcff",
    fontWeight: "700",
    marginBottom: 18,
  },

  lockedBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 14px",
    borderRadius: 14,
    marginBottom: 14,
    background:
      "rgba(255,0,0,0.12)",
    border:
      "1px solid rgba(255,0,0,0.2)",
    color: "#ffbaba",
    fontSize: 12,
    fontWeight: "700",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  inputBox: {
    width: "100%",
    height: 54,
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 14px",
    background:
      "rgba(255,255,255,0.05)",
    border:
      "1px solid rgba(255,255,255,0.05)",
    color:
      "rgba(255,255,255,0.75)",
    boxSizing: "border-box",
  },

  input: {
    flex: 1,
    height: "100%",
    background:
      "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    minWidth: 0,
  },

  eyeBtn: {
    border: "none",
    background:
      "transparent",
    color:
      "rgba(255,255,255,0.7)",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  errorBox: {
    padding: "12px",
    borderRadius: 14,
    background:
      "rgba(255,0,0,0.1)",
    border:
      "1px solid rgba(255,0,0,0.16)",
    color: "#ffb8b8",
    fontSize: 11,
    fontWeight: "700",
  },

  submitBtn: {
    width: "100%",
    border: "none",
    borderRadius: 16,
    marginTop: 4,
    background:
      "linear-gradient(135deg,#00d9ff,#6f6bff)",
    color: "#fff",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow:
      "0 0 35px rgba(0,217,255,0.25)",
    textTransform:
      "lowercase",
  },

  socials: {
    display: "grid",
    gap: 10,
    marginTop: 16,
  },

  socialBtn: {
    height: 50,
    borderRadius: 15,
    border:
      "1px solid rgba(255,255,255,0.06)",
    background:
      "rgba(255,255,255,0.04)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
    fontWeight: "700",
    fontSize: 12,
    textTransform:
      "lowercase",
  },

  moreBtn: {
    marginTop: 14,
    height: 50,
    borderRadius: 15,
    border:
      "1px solid rgba(255,255,255,0.06)",
    background:
      "rgba(255,255,255,0.03)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    padding: "0 14px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: 12,
    textTransform:
      "lowercase",
  },

  moreOptions: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 10,
    overflow: "hidden",
  },

  optionBtn: {
    height: 48,
    borderRadius: 14,
    border:
      "1px solid rgba(255,255,255,0.06)",
    background:
      "rgba(255,255,255,0.04)",
    color: "#d9e4ff",
    fontWeight: "700",
    fontSize: 12,
    cursor: "pointer",
    textTransform:
      "lowercase",
  },

  registerBtn: {
    marginTop: 16,
    height: 52,
    borderRadius: 16,
    border:
      "1px solid rgba(0,229,255,0.16)",
    background:
      "rgba(0,229,255,0.08)",
    color: "#9ff8ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
    fontWeight: "800",
    fontSize: 12,
    textTransform:
      "lowercase",
  },

  preview: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop)",
    backgroundSize: "cover",
    backgroundPosition:
      "center",
  },

  previewOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.1))",
  },

  previewContent: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    zIndex: 2,
  },

  previewBadge: {
    display: "inline-flex",
    padding: "7px 12px",
    borderRadius: 999,
    background:
      "rgba(255,255,255,0.12)",
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    textTransform:
      "lowercase",
    marginBottom: 14,
  },

  previewTitle: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "900",
    margin: 0,
    textTransform:
      "lowercase",
  },

  previewText: {
    color:
      "rgba(255,255,255,0.72)",
    marginTop: 12,
    fontSize: 14,
    lineHeight: 1.6,
    textTransform:
      "lowercase",
  },

};