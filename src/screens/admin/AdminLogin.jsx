import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AdminLogin({ onVerified, setView }) {
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [attempts, setAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState(null);

  const MASTER_KEY = "COMIC-CRAFT-SECRET-KEY-2024-ADMIN-ACCESS-30-CHARS";
  const MAX_ATTEMPTS = 5;
  const LOCK_TIME = 5 * 60 * 1000; // 5 minutes

  /* 🔄 LOAD STORAGE */
  useEffect(() => {
    const savedAttempts = parseInt(localStorage.getItem("admin_attempts")) || 0;
    const savedLock = parseInt(localStorage.getItem("admin_lockUntil"));

    setAttempts(savedAttempts);
    if (savedLock && Date.now() < savedLock) {
      setLockUntil(savedLock);
    } else {
      localStorage.removeItem("admin_lockUntil");
    }
  }, []);

  const isLocked = lockUntil && Date.now() < lockUntil;

  const handleVerify = () => {
    if (isLocked || loading) return;

    setLoading(true);

    setTimeout(() => {
      if (inputCode.trim() === MASTER_KEY) {
        // RESET
        localStorage.removeItem("admin_attempts");
        localStorage.removeItem("admin_lockUntil");

        setAttempts(0);
        setLockUntil(null);

        onVerified?.();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem("admin_attempts", newAttempts);

        setError(true);

        if (newAttempts >= MAX_ATTEMPTS) {
          const lockTime = Date.now() + LOCK_TIME;
          setLockUntil(lockTime);
          localStorage.setItem("admin_lockUntil", lockTime);
        }

        setTimeout(() => setError(false), 500);
      }

      setLoading(false);
    }, 500);
  };

  /* 🔴 LOCK SCREEN */
  if (isLocked) {
    const remaining = Math.ceil((lockUntil - Date.now()) / 1000);

    return (
      <div style={{ ...s.bg, backgroundColor: "#2d0000" }}>
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={s.box}
        >
          <h1 style={{ color: "#ff0000", fontWeight: "900" }}>
            SYSTÈME VERROUILLÉ
          </h1>

          <div style={s.warningBox}>
            <p>Trop de tentatives détectées.</p>
            <p style={{ fontWeight: "bold" }}>
              Réessaye dans {remaining}s
            </p>
          </div>

          <button onClick={() => setView("home")} style={s.btnBack}>
            RETOUR
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={s.bg}>
      <motion.div
        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
        style={s.box}
      >
        <div style={s.shieldIcon}>
          {attempts > 0 ? "⚠️" : "🛡️"}
        </div>

        <h1 style={s.title}>ADMIN AUTH</h1>

        <p style={s.sub}>
          Saisissez la clé<br />
          <span
            style={{
              color: error
                ? "#ff0000"
                : attempts > 0
                ? "#ffb300"
                : "#666",
              fontSize: "10px",
              fontWeight: "bold"
            }}
          >
            {error
              ? "ACCÈS REFUSÉ"
              : attempts > 0
              ? `Restant : ${MAX_ATTEMPTS - attempts}`
              : "TERMINAL SÉCURISÉ"}
          </span>
        </p>

        <input
          type="password"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          style={{
            ...s.input,
            borderColor: error
              ? "#ff0000"
              : attempts > 0
              ? "#ffb300"
              : "#333"
          }}
        />

        <button
          onClick={handleVerify}
          style={{
            ...s.btn,
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? "..." : "DÉVERROUILLER"}
        </button>

        <button onClick={() => setView("home")} style={s.btnBack}>
          ABANDONNER
        </button>
      </motion.div>
    </div>
  );
}

const s = {
  bg: {
    height: "100vh",
    backgroundColor: "#050505",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px"
  },
  box: {
    backgroundColor: "#0a0a0a",
    padding: "40px 30px",
    borderRadius: "20px",
    border: "1px solid #333",
    textAlign: "center",
    width: "100%",
    maxWidth: "400px"
  },
  shieldIcon: { fontSize: "40px", marginBottom: "10px" },
  title: { color: "#fff", fontSize: "22px", fontWeight: "900" },
  sub: { color: "#888", fontSize: "11px", margin: "20px 0" },
  warningBox: {
    border: "1px solid red",
    padding: "15px",
    color: "#ff4444",
    fontSize: "11px",
    borderRadius: "8px",
    margin: "20px 0"
  },
  input: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#000",
    border: "1px solid #333",
    color: "#00f7ff",
    borderRadius: "8px",
    textAlign: "center",
    marginBottom: "20px"
  },
  btn: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#fff",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    fontWeight: "900"
  },
  btnBack: {
    marginTop: "20px",
    background: "none",
    border: "none",
    color: "#555"
  }
};