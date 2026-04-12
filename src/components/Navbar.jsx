import React, { useState, useMemo } from "react";
import { useUserContext } from "../screens/users/userContext";

const NEON_COLORS = ["#ff003c", "#00f7ff", "#ff00ff", "#39ff14", "#ffd300", "#8f00ff"];

export default function Navbar({ setView }) {
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const { user } = useUserContext();

  // Couleur néon unique pour la session
  const neonColor = useMemo(() => {
    return NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
  }, []);

  const go = (view) => {
    setActiveTab(view);
    setShowMenu(false);

    // Sécurité Profil
    if (view === "profile" && !user) {
      setView("login");
      return;
    }

    // Sécurité Auteur
    if (view === "author_apply") {
      if (!user) { setView("login"); return; }
      if (user.role !== "author") { setView("access_code"); return; }
    }

    setView(view);
  };

  // Style dynamique pour l'état actif vs inactif
  const getTabStyle = (view) => {
    const isActive = activeTab === view;
    return {
      color: isActive ? neonColor : "#555",
      textShadow: isActive ? `0 0 8px ${neonColor}` : "none",
      transition: "color 0.3s ease",
    };
  };

  return (
    <div style={s.wrapper}>
      {/* Menu Flottant Compact */}
      {showMenu && (
        <div style={s.floatingMenu}>
          <div style={s.menuItem} onClick={() => go("messaging")}>💬 Messages</div>
          <div style={s.menuItem} onClick={() => go("contacts")}>👥 Contacts</div>
          <div style={{ ...s.menuItem, border: "none" }} onClick={() => go("author_apply")}>
            ✍️ Add Story
          </div>
          <div style={s.menuArrow}></div>
        </div>
      )}

      <nav style={s.navBar}>
        <div style={s.sideGroup}>
          <button onClick={() => go("home")} style={s.iconBtn}>
            <span style={{ ...s.icon, ...getTabStyle("home") }}>🏠</span>
            <span style={{ ...s.text, ...getTabStyle("home") }}>Accueil</span>
          </button>

          <button onClick={() => go("news")} style={s.iconBtn}>
            <span style={{ ...s.icon, ...getTabStyle("news") }}>🎡</span>
            <span style={{ ...s.text, ...getTabStyle("news") }}>News</span>
          </button>
        </div>

        {/* Bouton Central fixe sans zoom */}
        <div style={s.centerBtnWrapper} onClick={() => setShowMenu(!showMenu)}>
          <div style={{ ...s.glow, backgroundColor: neonColor }} />
          <div style={{ ...s.boltCircle, borderColor: neonColor, color: neonColor }}>
            ⚡
          </div>
        </div>

        <div style={s.sideGroup}>
          <button onClick={() => go("myseries")} style={s.iconBtn}>
            <span style={{ ...s.icon, ...getTabStyle("myseries") }}>📚</span>
            <span style={{ ...s.text, ...getTabStyle("myseries") }}>Séries</span>
          </button>

          <button onClick={() => go("profile")} style={s.iconBtn}>
            <span style={{ ...s.icon, ...getTabStyle("profile") }}>👤</span>
            <span style={{ ...s.text, ...getTabStyle("profile") }}>Profil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

const s = {
  wrapper: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    pointerEvents: "none",
  },
  navBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#050508", // Plus sombre pour faire ressortir le néon
    borderTop: "1px solid rgba(255,255,255,0.05)",
    width: "100%",
    height: "60px", // Réduit pour faire plus "App"
    padding: "0 10px",
    pointerEvents: "auto",
    boxShadow: "0 -2px 15px rgba(0,0,0,0.5)",
  },
  sideGroup: {
    display: "flex",
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  iconBtn: {
    background: "none",
    border: "none",
    padding: "5px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    width: "60px",
  },
  icon: {
    fontSize: "18px",
    marginBottom: "2px",
  },
  text: {
    fontSize: "9px",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },
  centerBtnWrapper: {
    position: "relative",
    top: "-15px", // Moins haut qu'avant pour la discrétion
    pointerEvents: "auto",
  },
  boltCircle: {
    width: "50px", // Réduit de 60px à 50px
    height: "50px",
    backgroundColor: "#050508",
    border: "2px solid",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
    zIndex: 2,
    position: "relative",
  },
  glow: {
    position: "absolute",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    filter: "blur(12px)",
    opacity: 0.5,
    top: 0,
    left: 0,
  },
  floatingMenu: {
    backgroundColor: "#0a0a0f",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "15px",
    width: "150px",
    marginBottom: "10px",
    pointerEvents: "auto",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(0,0,0,0.6)",
  },
  menuItem: {
    color: "#eee",
    padding: "12px",
    fontSize: "12px",
    textAlign: "center",
    borderBottom: "1px solid rgba(255,255,255,0.03)",
    cursor: "pointer",
  },
  menuArrow: {
    position: "absolute",
    bottom: "-5px",
    left: "50%",
    transform: "translateX(-50%) rotate(45deg)",
    width: "10px",
    height: "10px",
    backgroundColor: "#0a0a0f",
  },
};
