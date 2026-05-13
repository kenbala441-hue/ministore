import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ScrollText,
  Globe2,
  Flame,
  Ghost,
  Castle,
  Trees,
} from "lucide-react";

import { FABLES_DATABASE } from "../../../data/fablesDatabase";

export default function MythologySection({
  setView,
  setSelectedStory,
}) {
  const [activeTab, setActiveTab] = useState("Tous");

  // 🌍 CATÉGORIES ÉTENDUES
  const categories = [
    {
      name: "Tous",
      icon: <Globe2 size={12} />,
      color: "#00ffe1",
    },
    {
      name: "Contes de Fées",
      icon: <Sparkles size={12} />,
      color: "#ffb4ff",
    },
    {
      name: "Mythologie",
      icon: <ScrollText size={12} />,
      color: "#00d9ff",
    },
    {
      name: "Légende Africaine",
      icon: <Flame size={12} />,
      color: "#ff9f43",
    },
    {
      name: "Légendes Urbaines",
      icon: <Ghost size={12} />,
      color: "#ff5c5c",
    },
    {
      name: "Mythologie Japonaise",
      icon: <Castle size={12} />,
      color: "#ff4d6d",
    },
    {
      name: "Folklore Coréen",
      icon: <Trees size={12} />,
      color: "#7effa1",
    },
    {
      name: "Mythologie Nordique",
      icon: <Flame size={12} />,
      color: "#7ad7ff",
    },
    {
      name: "Légendes Chinoises",
      icon: <Sparkles size={12} />,
      color: "#ffd166",
    },
    {
      name: "Mythologie Grecque",
      icon: <ScrollText size={12} />,
      color: "#b892ff",
    },
    {
      name: "Légendes Arabes",
      icon: <Ghost size={12} />,
      color: "#00ffa3",
    },
    {
      name: "Folklore Indien",
      icon: <Sparkles size={12} />,
      color: "#ff7b54",
    },
  ];

  // 🔥 FILTRAGE SAFE
  const filteredFables = useMemo(() => {
    if (activeTab === "Tous") {
      return FABLES_DATABASE.slice(0, 18);
    }

    return FABLES_DATABASE.filter(
      (f) =>
        f?.category?.toLowerCase() ===
        activeTab.toLowerCase()
    ).slice(0, 18);
  }, [activeTab]);

  // 📖 OPEN STORY
  const openStory = (story) => {
    if (!story) return;

    setSelectedStory?.(story);
    setView?.("reader");

    try {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  return (
    <section style={s.container}>

      {/* HEADER */}
      <div style={s.header}>
        <div style={s.headerGlow} />

        <div style={s.headerLeft}>
          <div style={s.accentBar} />

          <div>
            <h2 style={s.title}>
              🌌 Mythes & Légendes
            </h2>

            <p style={s.subtitle}>
              Explore les récits oubliés du monde
            </p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={s.tabsWrapper}>
        {categories.map((cat) => {
          const active = activeTab === cat.name;

          return (
            <motion.button
              key={cat.name}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab(cat.name)}
              style={{
                ...s.tab,
                background: active
                  ? `linear-gradient(135deg, ${cat.color}, rgba(255,255,255,0.08))`
                  : "rgba(255,255,255,0.04)",

                border: active
                  ? `1px solid ${cat.color}`
                  : "1px solid rgba(255,255,255,0.05)",

                color: active ? "#000" : "#ddd",

                boxShadow: active
                  ? `0 0 18px ${cat.color}55`
                  : "none",
              }}
            >
              {cat.icon}
              {cat.name}
            </motion.button>
          );
        })}
      </div>

      {/* EMPTY */}
      {filteredFables.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={s.emptyBox}
        >
          <h4 style={s.emptyTitle}>
            🚧 Histoires bientôt disponibles
          </h4>

          <p style={s.emptyText}>
            Ce type d'histoire sera bientôt ajouté
            sur la plateforme ComicCrafte.
          </p>
        </motion.div>
      )}

      {/* STORIES */}
      <div style={s.scrollArea}>
        <AnimatePresence>
          {filteredFables.map((fable, i) => (
            <motion.div
              key={fable.id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.2,
                delay: i * 0.03,
              }}
              whileTap={{ scale: 0.97 }}
              style={s.card}
              onClick={() => openStory(fable)}
            >
              {/* IMAGE */}
              <div style={s.imageBox}>
                <img
                  src={fable.coverImage}
                  alt={fable.title}
                  loading="lazy"
                  style={s.image}
                />

                {/* OVERLAY */}
                <div style={s.overlay} />

                {/* BADGE */}
                <div style={s.badge}>
                  {fable.category?.split(" ")[0] || "Mythe"}
                </div>

                {/* NOUVEAU */}
                {i < 3 && (
                  <div style={s.newBadge}>
                    NEW
                  </div>
                )}
              </div>

              {/* TEXT */}
              <div style={s.textBox}>
                <h4 style={s.storyTitle}>
                  {fable.title}
                </h4>

                <p style={s.author}>
                  {fable.author || "Anonyme"}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* =========================
   🌌 REVOLUTION UI
========================= */

const s = {
  container: {
    width: "100%",
    margin: "14px 0",
    position: "relative",
  },

  header: {
    position: "relative",
    padding: "0 14px",
    marginBottom: "14px",
  },

  headerGlow: {
    position: "absolute",
    top: -10,
    left: 0,
    width: "100%",
    height: 60,
    background:
      "linear-gradient(90deg, rgba(0,255,225,0.08), transparent)",
    filter: "blur(20px)",
    pointerEvents: "none",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  accentBar: {
    width: 4,
    height: 26,
    borderRadius: 20,
    background:
      "linear-gradient(to bottom, #00ffe1, #0077ff)",
    boxShadow: "0 0 15px #00ffe1",
  },

  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 900,
    margin: 0,
    letterSpacing: 0.3,
  },

  subtitle: {
    color: "#666",
    fontSize: 11,
    marginTop: 2,
  },

  /* TABS */

  tabsWrapper: {
    display: "flex",
    overflowX: "auto",
    gap: 8,
    padding: "0 14px 14px",
    scrollbarWidth: "none",
    WebkitOverflowScrolling: "touch",
  },

  tab: {
    border: "none",
    minHeight: 34,
    padding: "0 14px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 800,
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    gap: 6,
    backdropFilter: "blur(12px)",
    transition: "0.2s",
    flexShrink: 0,
  },

  /* EMPTY */

  emptyBox: {
    margin: "0 14px 14px",
    padding: 18,
    borderRadius: 18,
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",

    border: "1px solid rgba(255,255,255,0.05)",
    backdropFilter: "blur(12px)",
  },

  emptyTitle: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 6,
  },

  emptyText: {
    color: "#777",
    fontSize: 11,
    lineHeight: 1.5,
  },

  /* STORIES */

  scrollArea: {
    display: "flex",
    overflowX: "auto",
    gap: 10,
    padding: "0 14px 6px",
    scrollbarWidth: "none",
    WebkitOverflowScrolling: "touch",
    scrollSnapType: "x mandatory",
  },

  card: {
    flex: "0 0 92px",
    scrollSnapAlign: "start",
    cursor: "pointer",
  },

  imageBox: {
    position: "relative",
    width: 92,
    height: 128,
    borderRadius: 16,
    overflow: "hidden",

    background:
      "linear-gradient(180deg, #1a1a1a, #111)",

    border: "1px solid rgba(255,255,255,0.05)",

    boxShadow:
      "0 10px 25px rgba(0,0,0,0.35)",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.9), transparent 60%)",
  },

  badge: {
    position: "absolute",
    bottom: 6,
    left: 6,

    padding: "3px 7px",

    borderRadius: 999,

    background:
      "rgba(0,0,0,0.55)",

    backdropFilter: "blur(10px)",

    color: "#00ffe1",
    fontSize: 7,
    fontWeight: 900,
    textTransform: "uppercase",

    border:
      "1px solid rgba(255,255,255,0.08)",
  },

  newBadge: {
    position: "absolute",
    top: 6,
    right: 6,

    padding: "2px 6px",

    borderRadius: 999,

    background:
      "linear-gradient(135deg, #00ffe1, #0077ff)",

    color: "#000",
    fontSize: 7,
    fontWeight: 900,
  },

  textBox: {
    paddingTop: 7,
  },

  storyTitle: {
    color: "#f1f1f1",
    fontSize: 10.5,
    fontWeight: 700,
    lineHeight: 1.3,

    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",

    overflow: "hidden",
  },

  author: {
    color: "#666",
    fontSize: 8.5,
    marginTop: 3,
  },
};