import React, { useState, useMemo } from "react";
import {
  Home,
  Newspaper,
  BookOpen,
  User,
  Plus,
  MessageCircle,
  Users,
  PenSquare,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { useUserContext } from "../screens/users/userContext";

const NEON_COLORS = [
  "#00e5ff",
  "#7a5cff",
  "#ff4fd8",
  "#39ff88",
];

export default function Navbar({ setView }) {
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const { user } = useUserContext();

  const neonColor = useMemo(() => {
    return NEON_COLORS[
      Math.floor(Math.random() * NEON_COLORS.length)
    ];
  }, []);

  const go = (view) => {
    setActiveTab(view);
    setShowMenu(false);

    // sécurité profil
    if (view === "profile" && !user) {
      setView("login");
      return;
    }

    // sécurité auteur
    if (view === "author_apply") {
      if (!user) {
        setView("login");
        return;
      }

      if (user.role !== "author") {
        setView("access_code");
        return;
      }
    }

    setView(view);
  };

  const tabs = [
    {
      id: "home",
      label: "Accueil",
      icon: Home,
    },
    {
      id: "news",
      label: "News",
      icon: Newspaper,
    },
    {
      id: "myseries",
      label: "Séries",
      icon: BookOpen,
    },
    {
      id: "profile",
      label: "Profil",
      icon: User,
    },
  ];

  return (
    <div style={s.wrapper}>
      {/* FLOAT MENU */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.18 }}
            style={s.menuContainer}
          >
            <button
              style={s.menuBtn}
              onClick={() => go("messaging")}
            >
              <MessageCircle size={15} />
              <span>Messages</span>
            </button>

            <button
              style={s.menuBtn}
              onClick={() => go("contacts")}
            >
              <Users size={15} />
              <span>Contacts</span>
            </button>

            <button
              style={{
                ...s.menuBtn,
                color: neonColor,
              }}
              onClick={() => go("author_apply")}
            >
              <PenSquare size={15} />
              <span>Publier</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <nav style={s.navbar}>
        {/* LEFT */}
        <div style={s.side}>
          {tabs.slice(0, 2).map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                style={s.navBtn}
                onClick={() => go(tab.id)}
              >
                <Icon
                  size={18}
                  color={active ? neonColor : "#666"}
                  strokeWidth={2.3}
                />

                <span
                  style={{
                    ...s.label,
                    color: active ? "#fff" : "#666",
                  }}
                >
                  {tab.label}
                </span>

                {active && (
                  <div
                    style={{
                      ...s.activeDot,
                      background: neonColor,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* CENTER */}
        <div style={s.centerWrapper}>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setShowMenu(!showMenu)}
            style={{
              ...s.centerBtn,
              border: `1px solid ${neonColor}55`,
              boxShadow: `0 0 20px ${neonColor}22`,
            }}
          >
            <div
              style={{
                ...s.centerGlow,
                background: neonColor,
              }}
            />

            <Plus
              size={20}
              color={neonColor}
              strokeWidth={2.8}
            />
          </motion.button>
        </div>

        {/* RIGHT */}
        <div style={s.side}>
          {tabs.slice(2).map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                style={s.navBtn}
                onClick={() => go(tab.id)}
              >
                <Icon
                  size={18}
                  color={active ? neonColor : "#666"}
                  strokeWidth={2.3}
                />

                <span
                  style={{
                    ...s.label,
                    color: active ? "#fff" : "#666",
                  }}
                >
                  {tab.label}
                </span>

                {active && (
                  <div
                    style={{
                      ...s.activeDot,
                      background: neonColor,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

const s = {
  wrapper: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    pointerEvents: "none",
  },

  navbar: {
    width: "100%",
    height: "62px",
    background: "rgba(5,7,12,0.96)",
    backdropFilter: "blur(18px)",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 6px",
    position: "relative",
    boxShadow: "0 -8px 30px rgba(0,0,0,0.45)",
    pointerEvents: "auto",
  },

  side: {
    flex: 1,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navBtn: {
    position: "relative",
    border: "none",
    background: "transparent",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "3px",
    minWidth: "54px",
    height: "100%",
    cursor: "pointer",
  },

  label: {
    fontSize: "9px",
    fontWeight: "700",
    letterSpacing: "0.3px",
    transition: "0.2s",
  },

  activeDot: {
    position: "absolute",
    bottom: "6px",
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    boxShadow: "0 0 8px currentColor",
  },

  centerWrapper: {
    position: "relative",
    top: "-16px",
    pointerEvents: "auto",
  },

  centerBtn: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "#090b11",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    cursor: "pointer",
  },

  centerGlow: {
    position: "absolute",
    inset: 0,
    opacity: 0.15,
    filter: "blur(18px)",
  },

  menuContainer: {
    marginBottom: "10px",
    width: "170px",
    borderRadius: "18px",
    background: "rgba(10,12,18,0.98)",
    border: "1px solid rgba(255,255,255,0.06)",
    backdropFilter: "blur(20px)",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0,0,0,0.55)",
    pointerEvents: "auto",
  },

  menuBtn: {
    width: "100%",
    border: "none",
    background: "transparent",
    color: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px 14px",
    fontSize: "12px",
    fontWeight: "700",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    cursor: "pointer",
    transition: "0.2s",
  },
};