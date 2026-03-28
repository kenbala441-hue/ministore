// VERSION ULTRA STRUCTURÉE MY SERIES (PRO UI + OFFLINE + UNDO DELETE + WEBTOON GRID)
// ⚠️ volontairement longue, optimisée et prête à scale

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2, Home, DownloadCloud, Heart, Clock,
  Unlock, Loader2, Settings, ChevronRight, X
} from "lucide-react";
import { COMICCRAFTE_STORIES } from "../../data/COMICCRAFTE_DATA";

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

                {displayList.map(item => {
                  const globalInfo = COMICCRAFTE_STORIES.find(s => s.id === item.id);
                  const cover = item.image || globalInfo?.cover;

                  return (
                    <div key={item.id} style={s.card}>

                      {/* IMAGE */}
                      <div style={s.imageWrapper} onClick={() => openReader(item)}>
                        <img src={cover} style={s.image} />

                        {activeTab === "TÉLÉCHARGEMENTS" && (
                          item.id === downloadingId ? (
                            <div style={s.downloading}>
                              <Loader2 size={16} />
                            </div>
                          ) : (
                            <div style={s.badge}>OFFLINE</div>
                          )
                        )}
                      </div>

                      {/* INFO */}
                      <div style={s.info} onClick={() => openReader(item)}>
                        <div style={s.title}>{item.title}</div>
                        <div style={s.subtitle}>
                          {item.chapter || "Ch.1"} • {item.type || "Story"}
                        </div>
                        <div style={s.continue}>
                          Continuer <ChevronRight size={12} />
                        </div>
                      </div>

                      {/* DELETE */}
                      <button style={s.deleteBtn} onClick={() => handleDelete(item)}>
                        <Trash2 size={16} />
                      </button>

                    </div>
                  );
                })}

              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* UNDO SYSTEM */}
      <AnimatePresence>
        {showUndo && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            style={s.undoBar}
          >
            <span>Supprimé</span>
            <button onClick={handleUndo}>Annuler</button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

const s = {
  container: {
    height: "100vh",
    background: "#050505",
    color: "#fff",
    display: "flex",
    flexDirection: "column"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px"
  },

  headerTitle: {
    fontSize: "20px",
    fontWeight: "900"
  },

  headerIcons: {
    display: "flex",
    gap: "10px"
  },

  iconBtn: {
    background: "#111",
    border: "none",
    padding: "10px",
    borderRadius: "10px"
  },

  tabContainer: {
    display: "flex",
    borderBottom: "1px solid #111"
  },

  tab: {
    padding: "10px",
    fontSize: "10px",
    cursor: "pointer"
  },

  content: {
    flex: 1,
    overflowY: "auto"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "10px",
    padding: "10px"
  },

  card: {
    display: "flex",
    gap: "10px",
    background: "#0d0d0f",
    padding: "10px",
    borderRadius: "15px"
  },

  imageWrapper: {
    position: "relative"
  },

  image: {
    width: "70px",
    height: "90px",
    borderRadius: "10px",
    objectFit: "cover"
  },

  badge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    background: "#00f7ff",
    color: "#000",
    fontSize: "8px",
    padding: "2px"
  },

  downloading: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  info: {
    flex: 1
  },

  title: {
    fontSize: "14px",
    fontWeight: "bold"
  },

  subtitle: {
    fontSize: "10px",
    color: "#666"
  },

  continue: {
    color: "#00f7ff",
    fontSize: "11px"
  },

  deleteBtn: {
    background: "none",
    border: "none"
  },

  emptyState: {
    textAlign: "center",
    marginTop: "50px",
    color: "#555"
  },

  undoBar: {
    position: "fixed",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#111",
    padding: "10px 20px",
    borderRadius: "20px",
    display: "flex",
    gap: "10px"
  }
};