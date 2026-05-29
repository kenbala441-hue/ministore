import React, { useEffect, useRef, useState } from "react";
import { auth, db, googleProvider } from "../../../firebase/index.js";
import {
  sendEmailVerification,
  signOut
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  MailCheck,
  ShieldCheck,
  RefreshCcw,
  LogOut,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VerifyEmailPage() {
  const navigate = useNavigate();

  const user = auth.currentUser;

  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");

  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);

  // 🔐 Anti spam / brute resend
  const [cooldown, setCooldown] = useState(0);

  // 🔄 Auto verification
  const intervalRef = useRef(null);

  // 🛡️ Nombre de tentatives
  const [attempts, setAttempts] = useState(0);

  // ⏱️ Countdown resend
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // 🔄 Vérification auto toutes les 6 sec
  useEffect(() => {
    if (!user) return;

    intervalRef.current = setInterval(async () => {
      try {
        await user.reload();

        if (user.emailVerified) {
          clearInterval(intervalRef.current);

          setType("success");
          setMessage("Email confirmé. Redirection...");

          setTimeout(() => {
            navigate("/home");
          }, 1500);
        }
      } catch (err) {
        console.error(err);
      }
    }, 6000);

    return () => clearInterval(intervalRef.current);
  }, [user, navigate]);

  // 📩 Renvoi email
  const handleResend = async () => {
    if (!user) return;

    // 🔐 Protection anti spam
    if (cooldown > 0) {
      setType("warning");
      setMessage(`Veuillez patienter ${cooldown}s.`);
      return;
    }

    // 🔐 Limite max
    if (attempts >= 5) {
      setType("error");
      setMessage("Trop de demandes. Réessayez plus tard.");
      return;
    }

    setSending(true);
    setMessage("");

    try {
      await sendEmailVerification(user);

      setAttempts((prev) => prev + 1);

      // ⏱️ Cooldown progressif
      setCooldown(45);

      setType("success");
      setMessage("Email de vérification envoyé avec succès.");
    } catch (error) {
      console.error(error);

      setType("error");
      setMessage("Impossible d'envoyer l'email.");
    }

    setSending(false);
  };

  // 🔄 Vérification manuelle
  const handleRefresh = async () => {
    if (!user) return;

    setChecking(true);

    try {
      await user.reload();

      if (user.emailVerified) {
        setType("success");
        setMessage("Compte vérifié avec succès.");

        setTimeout(() => {
          navigate("/home");
        }, 1200);
      } else {
        setType("warning");
        setMessage("Email non encore confirmé.");
      }
    } catch (err) {
      console.error(err);

      setType("error");
      setMessage("Erreur de synchronisation.");
    }

    setChecking(false);
  };

  // 🚪 Déconnexion
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={s.container}>
      {/* BACKGROUND FX */}
      <div style={s.blurOne}></div>
      <div style={s.blurTwo}></div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={s.card}
      >
        {/* ICON */}
        <div style={s.iconWrap}>
          <div style={s.iconCircle}>
            <MailCheck size={34} color="#fff" />
          </div>
        </div>

        {/* TITLE */}
        <h1 style={s.title}>Vérifiez votre email</h1>

        <p style={s.subtitle}>
          Un lien sécurisé a été envoyé à :
        </p>

        <div style={s.emailBox}>
          {user?.email || "Adresse inconnue"}
        </div>

        {/* SECURITY */}
        <div style={s.securityRow}>
          <div style={s.securityItem}>
            <ShieldCheck size={14} />
            <span>Protection active</span>
          </div>

          <div style={s.securityItem}>
            <Clock3 size={14} />
            <span>Auto vérification</span>
          </div>
        </div>

        {/* MESSAGE */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                ...s.message,
                background:
                  type === "success"
                    ? "rgba(34,197,94,0.12)"
                    : type === "warning"
                    ? "rgba(245,158,11,0.12)"
                    : "rgba(239,68,68,0.12)",

                border:
                  type === "success"
                    ? "1px solid rgba(34,197,94,0.3)"
                    : type === "warning"
                    ? "1px solid rgba(245,158,11,0.3)"
                    : "1px solid rgba(239,68,68,0.3)",

                color:
                  type === "success"
                    ? "#4ade80"
                    : type === "warning"
                    ? "#facc15"
                    : "#f87171"
              }}
            >
              {type === "success" && <CheckCircle2 size={16} />}
              {type === "warning" && <AlertTriangle size={16} />}
              {type === "error" && <AlertTriangle size={16} />}
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* BUTTONS */}
        <div style={s.buttons}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            onClick={handleResend}
            disabled={sending || cooldown > 0}
            style={{
              ...s.primaryBtn,
              opacity: sending || cooldown > 0 ? 0.6 : 1
            }}
          >
            {sending ? (
              <>
                <Loader2 size={16} className="spin" />
                Envoi...
              </>
            ) : cooldown > 0 ? (
              <>
                <Clock3 size={16} />
                Réessayer dans {cooldown}s
              </>
            ) : (
              <>
                <RefreshCcw size={16} />
                Renvoyer l'email
              </>
            )}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            onClick={handleRefresh}
            disabled={checking}
            style={s.secondaryBtn}
          >
            {checking ? (
              <>
                <Loader2 size={16} className="spin" />
                Vérification...
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                J'ai vérifié
              </>
            )}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            onClick={handleLogout}
            style={s.logoutBtn}
          >
            <LogOut size={16} />
            Se déconnecter
          </motion.button>
        </div>

        {/* FOOTER */}
        <div style={s.footer}>
          <span>
            🔐 Firebase Security • Anti spam • Auto Sync • Session protégée
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/* ======================================================
   STYLES
====================================================== */

const s = {
  container: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #111827 0%, #020617 45%, #000 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    overflow: "hidden",
    position: "relative",
    fontFamily: "Inter, sans-serif"
  },

  blurOne: {
    position: "absolute",
    width: "280px",
    height: "280px",
    borderRadius: "50%",
    background: "#7c3aed33",
    filter: "blur(90px)",
    top: "-50px",
    left: "-50px"
  },

  blurTwo: {
    position: "absolute",
    width: "280px",
    height: "280px",
    borderRadius: "50%",
    background: "#06b6d433",
    filter: "blur(90px)",
    bottom: "-80px",
    right: "-60px"
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(17,24,39,0.82)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "28px",
    padding: "30px 24px",
    backdropFilter: "blur(18px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
    position: "relative",
    zIndex: 5
  },

  iconWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "18px"
  },

  iconCircle: {
    width: "74px",
    height: "74px",
    borderRadius: "24px",
    background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 10px 30px rgba(124,58,237,0.4)"
  },

  title: {
    color: "#fff",
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "10px"
  },

  subtitle: {
    color: "#9ca3af",
    textAlign: "center",
    fontSize: "14px",
    lineHeight: "1.6",
    marginBottom: "14px"
  },

  emailBox: {
    background: "#0f172a",
    border: "1px solid #1e293b",
    padding: "14px",
    borderRadius: "14px",
    textAlign: "center",
    color: "#c4b5fd",
    fontWeight: "600",
    marginBottom: "20px",
    wordBreak: "break-word"
  },

  securityRow: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "20px"
  },

  securityItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#0b1220",
    border: "1px solid #1e293b",
    padding: "8px 12px",
    borderRadius: "999px",
    color: "#94a3b8",
    fontSize: "11px"
  },

  message: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px",
    borderRadius: "14px",
    marginBottom: "18px",
    fontSize: "13px",
    fontWeight: "500"
  },

  buttons: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  primaryBtn: {
    height: "52px",
    borderRadius: "16px",
    border: "none",
    background: "linear-gradient(90deg,#7c3aed,#06b6d4)",
    color: "#fff",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    transition: "0.25s"
  },

  secondaryBtn: {
    height: "52px",
    borderRadius: "16px",
    border: "1px solid #334155",
    background: "#111827",
    color: "#fff",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px"
  },

  logoutBtn: {
    height: "50px",
    borderRadius: "16px",
    border: "1px solid rgba(239,68,68,0.25)",
    background: "rgba(239,68,68,0.08)",
    color: "#f87171",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px"
  },

  footer: {
    marginTop: "22px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "11px",
    lineHeight: "1.5"
  }
};