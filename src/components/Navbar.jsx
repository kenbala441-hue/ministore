import React, { useState, useMemo } from "react";
import { useUserContext } from "../screens/users/userContext";
import NeonButton from "./NeonButton";

const NEON_COLORS = ["#ff003c", "#00f7ff", "#ff00ff", "#39ff14", "#ffd300", "#8f00ff"];

export default function Navbar({ setView }) {

  // 🔹 Étape 1 : États principaux
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  // 🔹 Étape 2 : Contexte utilisateur global
  const { user } = useUserContext();

  // 🔹 Étape 3 : Couleur dynamique premium
  const neonColor = useMemo(() => {
    return NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
  }, []);

  // 🔹 Étape 4 : Navigation sécurisée
const go = (view) => {
  setActiveTab(view);
  setShowMenu(false);

  // 🔐 Profil sécurisé
  if (view === "profile" && !user) {
    alert("Vous devez vous connecter pour accéder au profil !");
    setView("login");
    return;
  }

  // 🔐 AddStory sécurisé par rôle
  if (view === "author_apply") {
    if (!user) {
      alert("Connectez-vous pour accéder à Add Story !");
      setView("login");
      return;
    }

    if (user.role !== "author") {
      alert("Vous devez être auteur pour accéder à Add Story !");
      setView("access_code");
      return;
    }
  }

  // 🔹 Navigation normale
  setView(view);
};
  // 🔹 Étape 5 : Style actif premium
  const getActiveStyle = (view) => {
    if (activeTab !== view) return { color: "#777" };

    return {
      color: neonColor,
      textShadow: `0 0 10px ${neonColor}, 0 0 20px ${neonColor}`,
      transform: "scale(1.1)",
      transition: "all 0.3s ease",
    };
  };

  // 🔹 Étape 6 : Badge rôle utilisateur
  const renderUserBadge = () => {
    if (!user) return null;

    const roleColor =
      user.role === "admin"
        ? "#ff4dff"
        : user.role === "author"
        ? "#00f5ff"
        : "#a855f7";

    return (
      <div style={{ textAlign: "center", marginBottom: "5px", color: roleColor, fontSize: "11px" }}>
        {user.role?.toUpperCase()}
      </div>
    );
  };

  // 🔹 Étape 7 : Menu flottant sécurisé
  const renderFloatingMenu = () => (
    <div style={s.floatingMenu}>
      {renderUserBadge()}
      <div style={s.menuItem} onClick={() => go("messaging")}>💬 Messages</div>
      <div style={s.menuItem} onClick={() => go("contacts")}>👥 Contacts</div>
      <div style={{ ...s.menuItem, border: "none" }} onClick={() => go("author_apply")}>
        ✍️ Add Story
      </div>
      <div style={s.menuArrow}></div>
    </div>
  );

  // 🔹 Étape 8 : Rendu premium néon complet
  return (
    <div style={s.wrapper}>
      {showMenu && renderFloatingMenu()}

      <nav style={s.navBar}>
        <div style={s.sideGroup}>
          <button onClick={() => go("home")} style={{ ...s.iconBtn, ...getActiveStyle("home") }}>
            <span style={{ fontSize: "20px" }}>🏠</span>
            <span style={s.text}>Accueil</span>
          </button>

          <button onClick={() => go("news")} style={{ ...s.iconBtn, ...getActiveStyle("news") }}>
            <span style={{ fontSize: "20px" }}>🎡</span>
            <span style={s.text}>News</span>
          </button>
        </div>

        <div style={s.centerBtnWrapper} onClick={() => setShowMenu(v => !v)}>
          <div
            style={{
              ...s.glow,
              backgroundColor: neonColor,
              animation: "pulseGlow 2s infinite alternate",
            }}
          />
          <div
            style={{
              ...s.boltCircle,
              borderColor: neonColor,
              color: neonColor,
            }}
          >
            ⚡
          </div>
        </div>

        <div style={s.sideGroup}>
          <button onClick={() => go("myseries")} style={{ ...s.iconBtn, ...getActiveStyle("myseries") }}>
            <span style={{ fontSize: "20px" }}>📚</span>
            <span style={s.text}>Séries</span>
          </button>

          <button onClick={() => go("profile")} style={{ ...s.iconBtn, ...getActiveStyle("profile") }}>
            <span style={{ fontSize: "20px" }}>👤</span>
            <span style={s.text}>Profil</span>
          </button>
        </div>
      </nav>

      <style>{`
        @keyframes pulseGlow {
          0% { opacity: 0.4; transform: scale(0.95); }
          50% { opacity: 0.7; transform: scale(1.05); }
          100% { opacity: 0.4; transform: scale(0.95); }
        }
      `}</style>
    </div>
  );
}

const s = {
  wrapper: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 9999,
    pointerEvents: "none",
  },
  navBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0a0a0f",
    borderTop: "1px solid rgba(168,85,247,0.3)",
    padding: "10px 20px",
    width: "100%",
    height: "70px",
    boxShadow: "0 -5px 25px rgba(0,0,0,0.8)",
    pointerEvents: "auto",
  },
  sideGroup: {
    display: "flex",
    gap: "30px",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "all 0.3s ease",
    padding: "5px",
  },
  text: {
    fontSize: "10px",
    fontWeight: "600",
    marginTop: "4px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  centerBtnWrapper: {
    position: "relative",
    top: "-25px",
    cursor: "pointer",
    pointerEvents: "auto",
    zIndex: 10001,
  },
  boltCircle: {
    width: "60px",
    height: "60px",
    backgroundColor: "#0a0a0f",
    border: "3px solid",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "24px",
    transition: "all 0.3s ease",
  },
  glow: {
    position: "absolute",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    filter: "blur(18px)",
    opacity: 0.6,
    top: 0,
    left: 0,
  },
  floatingMenu: {
    backgroundColor: "rgba(10,10,15,0.98)",
    border: "1px solid #a855f7",
    borderRadius: "20px",
    padding: "8px",
    marginBottom: "15px",
    width: "170px",
    boxShadow: "0 10px 30px rgba(0,0,0,1), 0 0 15px rgba(168,85,247,0.3)",
    pointerEvents: "auto",
    position: "relative",
  },
  menuItem: {
    color: "#fff",
    padding: "12px",
    fontSize: "13px",
    textAlign: "center",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  menuArrow: {
    position: "absolute",
    bottom: "-8px",
    left: "50%",
    transform: "translateX(-50%) rotate(45deg)",
    width: "16px",
    height: "16px",
    backgroundColor: "#0a0a0f",
    borderRight: "1px solid #a855f7",
    borderBottom: "1px solid #a855f7",
  },
};