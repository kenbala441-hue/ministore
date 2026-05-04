import React, { useState, useMemo } from "react";
import { FABLES_DATABASE } from "../../../data/fablesDatabase";
import { motion, AnimatePresence } from "framer-motion";

export default function MythologySection({ setView, setSelectedStory }) {
  const [activeTab, setActiveTab] = useState("Tous");

  const categories = ["Tous", "Contes de Fées", "Mythologie", "Légende Africaine", "Légendes Urbaines"];

  const filteredFables = useMemo(() => {
    const data = activeTab === "Tous" ? FABLES_DATABASE : FABLES_DATABASE.filter(f => f.category === activeTab);
    return data.slice(0, 12); // On limite pour la performance
  }, [activeTab]);

  const handleOpen = (fable) => {
    setSelectedStory(fable);
    setView("reader");
    window.scrollTo(0, 0);
  };

  return (
    <div style={s.container}>
      {/* HEADER ÉPURÉ */}
      <div style={s.header}>
        <div style={s.accent} />
        <h3 style={s.title}>🌌 MYTHES & <span style={{ color: "#00f7ff" }}>LÉGENDES</span></h3>
      </div>

      {/* TABS STYLÉES */}
      <div style={s.tabScroll}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            style={{
              ...s.tab,
              background: activeTab === cat ? "linear-gradient(135deg, #00f7ff, #005f73)" : "#111",
              color: activeTab === cat ? "#000" : "#666",
              border: activeTab === cat ? "none" : "1px solid #222"
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* SCROLL HORIZONTAL (FINI LA GRID IMMENSE) */}
      <div style={s.scrollArea}>
        <AnimatePresence mode="wait">
          {filteredFables.map((fable, i) => (
            <motion.div
              key={fable.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleOpen(fable)}
              style={s.card}
            >
              <div style={s.imgBox}>
                <img src={fable.coverImage} alt="" style={s.img} />
                <div style={s.overlay}>
                  <span style={s.catBadge}>{fable.category?.split(' ')[0]}</span>
                </div>
              </div>
              <h4 style={s.fableTitle}>{fable.title}</h4>
              <p style={s.fableAuthor}>Par {fable.author || "Anonyme"}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

const s = {
  container: { padding: "10px 0", background: "transparent" },
  header: { padding: "0 15px", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" },
  accent: { width: "4px", height: "16px", backgroundColor: "#00f7ff", borderRadius: "10px" },
  title: { color: "#fff", fontSize: "15px", fontWeight: "900", letterSpacing: "0.5px" },
  
  tabScroll: {
    display: "flex",
    overflowX: "auto",
    gap: "8px",
    padding: "0 15px",
    marginBottom: "18px",
    scrollbarWidth: "none"
  },
  tab: {
    padding: "6px 14px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "800",
    whiteSpace: "nowrap",
    cursor: "pointer",
    transition: "0.3s"
  },

  scrollArea: {
    display: "flex",
    overflowX: "auto",
    gap: "12px",
    padding: "0 15px 10px",
    scrollbarWidth: "none",
    WebkitOverflowScrolling: "touch"
  },

  card: {
    flex: "0 0 100px", // TAILLE RÉDUITE ICI
    cursor: "pointer"
  },
  imgBox: {
    position: "relative",
    width: "100px",
    height: "140px",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#111",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
  },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.7) 10%, transparent 50%)",
    display: "flex",
    alignItems: "flex-end",
    padding: "6px"
  },
  catBadge: {
    fontSize: "7px",
    fontWeight: "900",
    color: "#00f7ff",
    textTransform: "uppercase"
  },
  fableTitle: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#eee",
    marginTop: "8px",
    display: "-webkit-box",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
    overflow: "hidden"
  },
  fableAuthor: {
    fontSize: "9px",
    color: "#555",
    marginTop: "2px"
  }
};
