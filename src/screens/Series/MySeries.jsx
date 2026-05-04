// VERSION ULTRA STRUCTURÉE MY SERIES (PRO UI + OFFLINE + UNDO DELETE + WEBTOON GRID)
// ⚠️ volontairement longue, optimisée et prête à scale

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2, Home, DownloadCloud, Heart, Clock,
  Unlock, Loader2, Settings, ChevronRight, X
} from "lucide-react";
import { COMICCRAFTE_STORIES } from "../../data/COMICCRAFTE_DATA";
import { FABLES_DATABASE } from "../../data/fablesDatabase.js"; 

export default function MySeries({
  setView,
  setSelectedStory,
  savedData,
  removeItem,
  downloadingId
}) {
  const [activeTab, setActiveTab] = useState("RÉCENT");
  const [undoItem, setUndoItem] = useState(null);
  const [showUndo, setShowUndo] = useState(false);
  const undoTimer = useRef(null);

  const tabs = [
    { id: "RÉCENT", key: "recent", icon: <Clock size={14} /> },
    { id: "FAVORI", key: "favorites", icon: <Heart size={14} /> },
    { id: "TÉLÉCHARGEMENTS", key: "downloads", icon: <DownloadCloud size={14} /> },
    { id: "DÉBLOQUÉ", key: "unlocked", icon: <Unlock size={14} /> }
  ];

  const currentTabKey = tabs.find(t => t.id === activeTab)?.key || "recent";
  const displayList = savedData[currentTabKey] || [];

  const handleDelete = (item) => {
    setUndoItem({ ...item, category: currentTabKey });
    setShowUndo(true);

    removeItem(item.id, currentTabKey);

    if (undoTimer.current) clearTimeout(undoTimer.current);

    undoTimer.current = setTimeout(() => {
      setShowUndo(false);
      setUndoItem(null);
    }, 5000);
  };

  const handleUndo = () => {
    if (!undoItem) return;

    const key = `comicrafte_${undoItem.category}`;
    const current = JSON.parse(localStorage.getItem(key)) || [];

    localStorage.setItem(
      key,
      JSON.stringify([undoItem, ...current])
    );

    window.dispatchEvent(new Event("storage"));

    setUndoItem(null);
    setShowUndo(false);
    clearTimeout(undoTimer.current);
  };

  const openReader = (item) => {
    setSelectedStory(item);
    setView("reader");
  };

  return (
    <div style={s.container}>

      {/* HEADER */}
      <div style={s.header}>
        <h2 style={s.headerTitle}>Ma Bibliothèque</h2>
        <div style={s.headerIcons}>
          <button style={s.iconBtn} onClick={() => setView("settings")}>
            <Settings size={20} />
          </button>
          <button style={s.iconBtn} onClick={() => setView("home")}>
            <Home size={20} color="#00f7ff" />
          </button>
        </div>
      </div>

      {/* TABS */}
      <div style={s.tabContainer}>
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...s.tab,
              color: activeTab === tab.id ? "#00f7ff" : "#666",
              borderBottom: activeTab === tab.id ? "2px solid #00f7ff" : "none"
            }}
          >
            {tab.icon}
            {tab.id}
          </div>
        ))}
      </div>

      {/* CONTENT */}
      <div style={s.content}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >

            {displayList.length === 0 ? (
              <div style={s.emptyState}>Aucune série</div>
            ) : (
              <div style={s.grid}>

      {displayList.map((item) => {
                  // 1. Recherche sécurisée dans les deux bases (insensible à la casse)
                  const globalInfo = 
                    COMICCRAFTE_STORIES.find(s => s.id?.toLowerCase() === item.id?.toLowerCase()) || 
                    FABLES_DATABASE.find(s => s.id?.toLowerCase() === item.id?.toLowerCase());

                  // 2. Priorité d'image : coverImage (Fables) > cover (Ancien) > image stockée
                  const cover = 
                    globalInfo?.coverImage || 
                    globalInfo?.cover || 
                    item.image || 
                    "https://via.placeholder.com/150x200?text=No+Cover";

                  return (
                    <div key={item.id} style={s.card}>

                      {/* IMAGE : FORMAT WEBTOON */}
                      <div style={s.imageWrapper} onClick={() => openReader(item)}>
                        <img 
                          src={cover} 
                          style={s.image} 
                          alt={item.title}
                          onError={(e) => { e.target.src = "https://via.placeholder.com/150x200?text=Error"; }}
                        />

                        {/* INDICATEURS OFFLINE / DOWNLOAD */}
                        {activeTab === "TÉLÉCHARGEMENTS" && (
                          <div style={s.statusOverlay}>
                            {item.id === downloadingId ? (
                              <div style={s.downloading}>
                                <Loader2 size={18} color="#00f7ff" className="animate-spin" />
                              </div>
                            ) : (
                              <div style={s.badge}>OFFLINE</div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* SECTION INFOS */}
                      <div style={s.info} onClick={() => openReader(item)}>
                        <div style={s.title}>{item.title || globalInfo?.title}</div>
                        <div style={s.subtitle}>
                          {item.chapter || "Ch. 1"} • {globalInfo?.category || globalInfo?.type || "Histoire"}
                        </div>
                        <div style={s.continue}>
                          Continuer <ChevronRight size={14} />
                        </div>
                      </div>

                      {/* BOUTON SUPPRIMER */}
                      <button style={s.deleteBtn} onClick={() => handleDelete(item)}>
                        <Trash2 size={18} color="#333" />
                      </button>

                    </div>
                  );
                })}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* SYSTÈME D'ANNULATION (UNDO) */}
      <AnimatePresence>
        {showUndo && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            style={s.undoBar}
          >
            <span>Supprimé</span>
            <button 
              onClick={handleUndo} 
              style={{ background: 'none', border: 'none', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Annuler
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// TON OBJET CONST S COMMENCE ICI...
const s = {
  container: {
    height: "100vh",
    background: "#050505", // Noir profond pour faire ressortir les couleurs
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Inter', sans-serif"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    background: "rgba(5, 5, 5, 0.8)",
    backdropFilter: "blur(10px)",
    position: "sticky",
    top: 0,
    zIndex: 10
  },

  headerTitle: {
    fontSize: "22px",
    fontWeight: "800",
    letterSpacing: "-0.5px"
  },

  headerIcons: {
    display: "flex",
    gap: "12px"
  },

  iconBtn: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "10px",
    borderRadius: "12px",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },

  tabContainer: {
    display: "flex",
    gap: "20px",
    padding: "0 20px",
    borderBottom: "1px solid #1a1a1c",
    overflowX: "auto"
  },

  tab: {
    padding: "12px 5px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap"
  },

  content: {
    flex: 1,
    overflowY: "auto",
    padding: "15px"
  },

  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  card: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    background: "#111113", 
    borderRadius: "14px",
    overflow: "hidden",
    border: "1px solid #1a1a1c",
    height: "110px", // Hauteur parfaite pour le format Webtoon
    transition: "transform 0.2s ease",
    cursor: "pointer"
  },

  imageWrapper: {
    position: "relative",
    height: "100%",
    width: "85px", // Largeur fixe style catalogue Webtoon
    flexShrink: 0
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },

  statusOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
    display: "flex",
    alignItems: "flex-end",
    padding: "5px"
  },

  badge: {
    background: "#00f7ff",
    color: "#000",
    fontSize: "9px",
    fontWeight: "900",
    padding: "2px 6px",
    borderRadius: "4px",
    boxShadow: "0 2px 10px rgba(0, 247, 255, 0.3)"
  },

  info: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },

  title: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "4px",
    display: "-webkit-box",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
    overflow: "hidden"
  },

  subtitle: {
    fontSize: "12px",
    color: "#666",
    marginBottom: "8px"
  },

  continue: {
    color: "#00f7ff",
    fontSize: "12px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "4px"
  },

  deleteBtn: {
    background: "none",
    border: "none",
    padding: "15px",
    opacity: 0.3,
    transition: "opacity 0.2s ease",
    cursor: "pointer"
  },

  undoBar: {
    position: "fixed",
    bottom: 30,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#00f7ff",
    color: "#000",
    padding: "12px 25px",
    borderRadius: "30px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    fontWeight: "bold",
    boxShadow: "0 10px 30px rgba(0, 247, 255, 0.4)",
    zIndex: 100
  }
};
