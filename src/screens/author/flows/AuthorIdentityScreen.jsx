import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  UserRound,
  MapPin,
  Sparkles,
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  PenSquare,
  Layers3,
  AlertTriangle,
  ScanFace,
} from "lucide-react";

export default function AuthorIdentityScreen({ setView }) {
  const [fullName, setFullName] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [city, setCity] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [post, setPost] = useState("");
  const [level, setLevel] = useState("Débutant");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔒 HONEYPOT BOT
  const [website, setWebsite] = useState("");

  // 🔒 DEVICE FINGERPRINT
  const [fingerprint, setFingerprint] = useState("");

  useEffect(() => {
    const fp = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    ].join("::");

    setFingerprint(btoa(fp));
  }, []);

  // 🔒 ANALYSE COMPORTEMENT
  const [typingSpeed, setTypingSpeed] = useState([]);
  const [startTyping, setStartTyping] = useState(Date.now());

  const handleTyping = () => {
    const now = Date.now();
    setTypingSpeed((prev) => [...prev, now - startTyping]);
    setStartTyping(now);
  };

  // 🔒 FIREBASE LOGS (simulation)
  const logSecurityEvent = (message) => {
    console.log("SECURITY LOG:", {
      message,
      fingerprint,
      timestamp: new Date(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔒 HONEYPOT
    if (website) {
      logSecurityEvent("BOT DETECTED");
      setError("Activité non autorisée détectée.");
      return;
    }

    // 🔒 BOT SPEED DETECTION
    const suspicious = typingSpeed.some((t) => t < 20);

    if (suspicious) {
      logSecurityEvent("SUSPICIOUS INPUT SPEED");
      setError(
        "Le système a détecté une activité inhabituelle."
      );
      return;
    }

    if (
      !fullName ||
      !pseudo ||
      !city ||
      !birthDate ||
      !post
    ) {
      setError(
        "Veuillez compléter toutes les informations obligatoires."
      );
      return;
    }

    setLoading(true);

    setTimeout(() => {
      logSecurityEvent("IDENTITY VERIFIED");

      setLoading(false);

      setView("author_terms");
    }, 1800);
  };

  return (
    <div style={s.wrapper}>
      {/* BACKGROUND */}
      <div style={s.glowOne} />
      <div style={s.glowTwo} />
      <div style={s.grid} />

      {/* CARD */}
      <div style={s.card}>
        {/* HEADER */}
        <div style={s.header}>
          <button
            onClick={() => setView("author_access")}
            style={s.backBtn}
          >
            <ArrowLeft size={17} />
          </button>

          <div style={s.logo}>
            <ShieldCheck size={34} />
          </div>

          <div style={s.badge}>
            <Sparkles size={12} />
            <span>Vérification Sécurisée</span>
          </div>

          <h1 style={s.title}>
            Vérification{" "}
            <span style={s.accent}>d’Identité</span>
          </h1>

          <p style={s.subtitle}>
            Veuillez saisir les informations associées à
            votre carte d’accès afin de continuer la
            procédure de validation auteur ComicCrafte.
          </p>
        </div>

        {/* INFO BOX */}
        <div style={s.infoBox}>
          <ScanFace size={17} color="#00e0ff" />

          <span>
            Les informations saisies sont analysées et
            protégées par le système de sécurité du studio.
          </span>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          {/* HONEYPOT */}
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            autoComplete="off"
            tabIndex="-1"
            style={s.honeypot}
          />

          {/* NOM */}
          <div style={s.inputGroup}>
            <div style={s.label}>
              <UserRound size={15} />
              <span>Nom complet</span>
            </div>

            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                handleTyping();
                setError("");
              }}
              placeholder="Ex : Ken Mikael"
              style={s.input}
            />
          </div>

          {/* PSEUDO */}
          <div style={s.inputGroup}>
            <div style={s.label}>
              <PenSquare size={15} />
              <span>Pseudonyme Auteur</span>
            </div>

            <input
              type="text"
              value={pseudo}
              onChange={(e) => {
                setPseudo(e.target.value);
                handleTyping();
                setError("");
              }}
              placeholder="Ex : Kinkarou Daiko"
              style={s.input}
            />
          </div>

          {/* VILLE */}
          <div style={s.inputGroup}>
            <div style={s.label}>
              <MapPin size={15} />
              <span>Ville / Région</span>
            </div>

            <input
              type="text"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                handleTyping();
                setError("");
              }}
              placeholder="Ex : Kinshasa"
              style={s.input}
            />
          </div>

          {/* DATE */}
          <div style={s.inputGroup}>
            <div style={s.label}>
              <CalendarDays size={15} />
              <span>Date de naissance</span>
            </div>

            <input
              type="date"
              value={birthDate}
              onChange={(e) => {
                setBirthDate(e.target.value);
                setError("");
              }}
              style={s.input}
            />
          </div>

          {/* POSTE */}
          <div style={s.inputGroup}>
            <div style={s.label}>
              <BadgeCheck size={15} />
              <span>Poste / Spécialité</span>
            </div>

            <input
              type="text"
              value={post}
              onChange={(e) => {
                setPost(e.target.value);
                handleTyping();
                setError("");
              }}
              placeholder="Auteur • Illustrateur • Scénariste"
              style={s.input}
            />
          </div>

          {/* LEVEL */}
          <div style={s.inputGroup}>
            <div style={s.label}>
              <Layers3 size={15} />
              <span>Niveau créatif</span>
            </div>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              style={s.input}
            >
              <option>Débutant</option>
              <option>Intermédiaire</option>
              <option>Confirmé</option>
              <option>Professionnel</option>
            </select>
          </div>

          {/* ERROR */}
          {error && (
            <div style={s.errorBox}>
              <AlertTriangle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...s.button,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "Analyse sécurisée..."
              : "Continuer"}
          </button>
        </form>

        {/* FOOTER */}
        <div style={s.footer}>
          <p style={s.footerText}>
            ComicCrafte Studio utilise des systèmes
            automatisés de sécurité, d’analyse et de
            protection afin de préserver les accès auteurs
            et prévenir toute activité non autorisée.
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  wrapper: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left,#08131f,#05070d 45%,#020308)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    overflow: "hidden",
    position: "relative",
    fontFamily: "'Inter', sans-serif",
  },

  glowOne: {
    position: "absolute",
    width: "320px",
    height: "320px",
    background: "#00e0ff",
    filter: "blur(160px)",
    opacity: 0.12,
    top: "-100px",
    left: "-100px",
  },

  glowTwo: {
    position: "absolute",
    width: "320px",
    height: "320px",
    background: "#7a5cff",
    filter: "blur(160px)",
    opacity: 0.14,
    bottom: "-100px",
    right: "-100px",
  },

  grid: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
  },

  card: {
    width: "100%",
    maxWidth: "460px",
    background: "rgba(10,12,18,0.92)",
    borderRadius: "32px",
    padding: "28px",
    border: "1px solid rgba(255,255,255,0.06)",
    backdropFilter: "blur(25px)",
    boxShadow: "0 20px 70px rgba(0,0,0,0.6)",
    position: "relative",
    zIndex: 2,
  },

  header: {
    textAlign: "center",
    marginBottom: "24px",
    position: "relative",
  },

  backBtn: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "42px",
    height: "42px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  logo: {
    width: "82px",
    height: "82px",
    borderRadius: "26px",
    margin: "0 auto 18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#00e0ff",
    background:
      "linear-gradient(135deg, rgba(0,224,255,0.12), rgba(122,92,255,0.12))",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 0 50px rgba(0,224,255,0.16)",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "#d7deea",
    fontSize: "11px",
    fontWeight: "700",
    marginBottom: "18px",
  },

  title: {
    color: "#fff",
    fontSize: "30px",
    fontWeight: "900",
    margin: "0 0 12px",
  },

  accent: {
    background: "linear-gradient(90deg,#00e0ff,#7a5cff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    color: "rgba(255,255,255,0.65)",
    fontSize: "13px",
    lineHeight: 1.7,
  },

  infoBox: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    background: "rgba(0,224,255,0.05)",
    border: "1px solid rgba(0,224,255,0.12)",
    padding: "14px",
    borderRadius: "18px",
    marginBottom: "22px",
    color: "#dce7f7",
    fontSize: "12px",
    lineHeight: 1.5,
  },

  inputGroup: {
    marginBottom: "16px",
  },

  label: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "10px",
    color: "#cfd6e4",
    fontSize: "12px",
    fontWeight: "700",
  },

  input: {
    width: "100%",
    height: "56px",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    color: "#fff",
    padding: "0 18px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(255,59,92,0.08)",
    border: "1px solid rgba(255,59,92,0.2)",
    padding: "12px",
    borderRadius: "14px",
    marginBottom: "16px",
    color: "#ff6b81",
    fontSize: "12px",
    fontWeight: "700",
  },

  button: {
    width: "100%",
    height: "58px",
    border: "none",
    borderRadius: "18px",
    background:
      "linear-gradient(90deg,#00e0ff,#7a5cff,#8f44ff)",
    color: "#fff",
    fontWeight: "800",
    fontSize: "14px",
    cursor: "pointer",
    transition: "0.3s",
    boxShadow: "0 10px 35px rgba(0,224,255,0.18)",
    marginTop: "10px",
  },

  footer: {
    marginTop: "22px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    paddingTop: "18px",
  },

  footerText: {
    color: "rgba(255,255,255,0.38)",
    fontSize: "11px",
    lineHeight: 1.7,
    textAlign: "center",
  },

  honeypot: {
    position: "absolute",
    opacity: 0,
    pointerEvents: "none",
    height: 0,
  },
};