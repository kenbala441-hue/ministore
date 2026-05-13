import React, { useState } from "react";
import {
  ShieldCheck,
  KeyRound,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  BadgeCheck
} from "lucide-react";

function AuthorAccessScreen({ setView, setAuthorData }) {
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 DATABASE TEST
  const fakeDatabaseCodes = [
    "ABCDEF1234567890XYZABCDEF1234567890",
    "ZYX9876543210QWERTY1234567890ASDFG",
    "TESTACCESSCODE1234567890123456789"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accessCode.trim()) {
      setError("Veuillez entrer votre carte d'accès auteur.");
      return;
    }

    if (accessCode.length < 20) {
      setError("Code d'accès invalide ou incomplet.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const matchedCode = fakeDatabaseCodes.find(
        (c) => c === accessCode
      );

      if (!matchedCode) {
        setError("Carte d'accès non reconnue.");
        setLoading(false);
        return;
      }

      setError("");

      setAuthorData({
        accessCode: matchedCode,
        fullName: "",
        pseudo: "",
        city: "",
        level: "Débutant",
        photoURL: "",
        email: "",
        status: "En attente",
      });

      setLoading(false);
      setView("author_identity");
    }, 1200);
  };

  return (
    <div style={s.wrapper}>
      {/* BACKGROUND */}
      <div style={s.glowOne} />
      <div style={s.glowTwo} />

      {/* CARD */}
      <div style={s.card}>
        
        {/* TOP */}
        <div style={s.top}>
          <div style={s.logoBox}>
            <ShieldCheck size={34} />
          </div>

          <div style={s.badge}>
            <Sparkles size={13} />
            <span>Programme Auteur Premium</span>
          </div>

          <h1 style={s.title}>
            Accès <span style={s.accent}>ComicCrafte Studio</span>
          </h1>

          <p style={s.subtitle}>
            Entrez votre carte d’accès officielle afin de débloquer
            l’espace auteur sécurisé du studio.
          </p>
        </div>

        {/* INFO BOX */}
        <div style={s.infoBox}>
          <BadgeCheck size={16} color="#00e0ff" />

          <span>
            Seuls les auteurs validés ou recommandés peuvent accéder à
            cette interface.
          </span>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          
          <div style={s.inputWrapper}>
            <div style={s.inputLabel}>
              <KeyRound size={15} />
              <span>Carte d’accès auteur</span>
            </div>

            <input
              type="text"
              value={accessCode}
              onChange={(e) => {
                setAccessCode(e.target.value.toUpperCase());
                setError("");
              }}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              style={s.input}
              maxLength={50}
            />

            <div style={s.inputBottom}>
              <span>Code sécurisé • accès privé</span>
              <span>{accessCode.length}/50</span>
            </div>
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
            {loading ? "Vérification..." : "Continuer"}
          </button>
        </form>

        {/* FOOTER */}
        <div style={s.footer}>
          <div
            style={s.footerBtn}
            onClick={() => setView("author_apply")}
          >
            <span>Faire une demande auteur</span>

            <ChevronRight size={15} />
          </div>

          <p style={s.footerText}>
            Vous ne possédez pas encore de carte d’accès ?
            Faites une demande afin d’être évalué par le studio.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthorAccessScreen;

const s = {
  wrapper: {
    minHeight: "100vh",
    background: "#05070d",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Inter', sans-serif",
  },

  glowOne: {
    position: "absolute",
    top: "-120px",
    left: "-120px",
    width: "280px",
    height: "280px",
    background: "#00e0ff",
    filter: "blur(140px)",
    opacity: 0.18,
  },

  glowTwo: {
    position: "absolute",
    bottom: "-120px",
    right: "-120px",
    width: "280px",
    height: "280px",
    background: "#7a5cff",
    filter: "blur(140px)",
    opacity: 0.18,
  },

  card: {
    width: "100%",
    maxWidth: "430px",
    background: "rgba(10,12,18,0.92)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "30px",
    padding: "28px",
    position: "relative",
    zIndex: 2,
    backdropFilter: "blur(25px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
  },

  top: {
    textAlign: "center",
    marginBottom: "24px",
  },

  logoBox: {
    width: "78px",
    height: "78px",
    borderRadius: "24px",
    margin: "0 auto 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#00e0ff",
    background:
      "linear-gradient(135deg, rgba(0,224,255,0.12), rgba(122,92,255,0.12))",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 0 40px rgba(0,224,255,0.15)",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 12px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "#cfd6e4",
    fontSize: "11px",
    fontWeight: "700",
    marginBottom: "18px",
  },

  title: {
    color: "#fff",
    fontSize: "30px",
    fontWeight: "900",
    lineHeight: 1.1,
    margin: "0 0 12px",
  },

  accent: {
    background: "linear-gradient(90deg,#00e0ff,#7a5cff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    color: "rgba(255,255,255,0.68)",
    fontSize: "13px",
    lineHeight: 1.7,
    margin: 0,
  },

  infoBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(0,224,255,0.05)",
    border: "1px solid rgba(0,224,255,0.12)",
    padding: "14px",
    borderRadius: "16px",
    marginBottom: "22px",
    color: "#d9e2f2",
    fontSize: "12px",
    lineHeight: 1.5,
  },

  inputWrapper: {
    marginBottom: "18px",
  },

  inputLabel: {
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
    letterSpacing: "1px",
    fontWeight: "600",
  },

  inputBottom: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "8px",
    color: "rgba(255,255,255,0.35)",
    fontSize: "10px",
    fontWeight: "600",
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
    fontWeight: "600",
  },

  button: {
    width: "100%",
    height: "56px",
    border: "none",
    borderRadius: "18px",
    background: "linear-gradient(90deg,#00e0ff,#7a5cff)",
    color: "#fff",
    fontWeight: "800",
    fontSize: "14px",
    cursor: "pointer",
    transition: "0.3s",
    boxShadow: "0 10px 30px rgba(0,224,255,0.18)",
  },

  footer: {
    marginTop: "24px",
    paddingTop: "20px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },

  footerBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: "14px 16px",
    borderRadius: "16px",
    cursor: "pointer",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "700",
  },

  footerText: {
    marginTop: "12px",
    color: "rgba(255,255,255,0.45)",
    fontSize: "11px",
    lineHeight: 1.6,
    textAlign: "center",
  },
};