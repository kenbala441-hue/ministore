// MY SERIES V3 — WEBTOON PREMIUM EDITION
// ultra compact • persistent storage • smoother • mobile optimized • production ready

import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  Trash2,
  Home,
  Download,
  Heart,
  Clock3,
  Unlock,
  Settings2,
  ChevronRight,
  Loader2,
  Search,
  Sparkles,
  MoreHorizontal,
  BookOpen,
  CloudCheck,
} from "lucide-react";

import { COMICCRAFTE_STORIES } from "../../data/COMICCRAFTE_DATA";
import { FABLES_DATABASE } from "../../data/fablesDatabase.js";

const STORAGE_KEY = "comicrafte_library_v3";

export default function MySeries({
  setView,
  setSelectedStory,
  savedData = {},
  removeItem,
  downloadingId,
}) {
  const [activeTab, setActiveTab] = useState("recent");
  const [search, setSearch] = useState("");
  const [undoItem, setUndoItem] = useState(null);
  const [showUndo, setShowUndo] = useState(false);
  const [localData, setLocalData] = useState(savedData);

  const undoTimer = useRef(null);

  // =========================
  // PERSISTENT STORAGE
  // =========================

  useEffect(() => {
    try {
      const cache = localStorage.getItem(STORAGE_KEY);

      if (cache) {
        setLocalData(JSON.parse(cache));
      }
    } catch (err) {
      console.error("Storage read error:", err);
    }
  }, []);

  useEffect(() => {
    if (!savedData) return;

    setLocalData(savedData);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(savedData)
      );
    } catch (err) {
      console.error("Storage write error:", err);
    }
  }, [savedData]);

  // =========================
  // TABS
  // =========================

  const tabs = [
    {
      id: "recent",
      label: "Récents",
      icon: <Clock3 size={12} />,
    },
    {
      id: "favorites",
      label: "Favoris",
      icon: <Heart size={12} />,
    },
    {
      id: "downloads",
      label: "Offline",
      icon: <Download size={12} />,
    },
    {
      id: "unlocked",
      label: "Premium",
      icon: <Unlock size={12} />,
    },
  ];

  // =========================
  // CURRENT LIST
  // =========================

  const currentList = useMemo(() => {
    return localData?.[activeTab] || [];
  }, [localData, activeTab]);

  // =========================
  // SEARCH FILTER
  // =========================

  const filteredList = useMemo(() => {
    if (!search.trim()) return currentList;

    return currentList.filter((item) =>
      item?.title
        ?.toLowerCase()
        ?.includes(search.toLowerCase())
    );
  }, [currentList, search]);

  // =========================
  // OPEN READER
  // =========================

  const openReader = useCallback(
    (story) => {
      if (!story) return;

      try {
        localStorage.setItem(
          "comicrafte_last_story",
          JSON.stringify(story)
        );
      } catch {}

      setSelectedStory?.(story);
      setView?.("reader");
    },
    [setSelectedStory, setView]
  );

  // =========================
  // DELETE + UNDO
  // =========================

  const handleDelete = useCallback(
    (item) => {
      if (!item?.id) return;

      setUndoItem({
        ...item,
        category: activeTab,
      });

      setShowUndo(true);

      removeItem?.(item.id, activeTab);

      clearTimeout(undoTimer.current);

      undoTimer.current = setTimeout(() => {
        setUndoItem(null);
        setShowUndo(false);
      }, 4500);
    },
    [activeTab, removeItem]
  );

  const handleUndo = useCallback(() => {
    if (!undoItem) return;

    try {
      const updated = {
        ...localData,
        [undoItem.category]: [
          undoItem,
          ...(localData?.[undoItem.category] || []),
        ],
      };

      setLocalData(updated);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updated)
      );
    } catch (err) {
      console.error(err);
    }

    setUndoItem(null);
    setShowUndo(false);

    clearTimeout(undoTimer.current);
  }, [undoItem, localData]);

  // =========================
  // STATS
  // =========================

  const totalStories = useMemo(() => {
    return Object.values(localData || {})
      .flat()
      .length;
  }, [localData]);

  // =========================
  // RENDER
  // =========================

  return (
    <div style={s.container}>
      {/* BACKGROUND */}
      <div style={s.glowTop} />
      <div style={s.glowBottom} />

      {/* HEADER */}
      <div style={s.header}>
        <div>
          <div style={s.badge}>
            <Sparkles size={9} />
            <span>WEBTOON LIBRARY</span>
          </div>

          <h1 style={s.title}>Ma Série</h1>

          <div style={s.subtitle}>
            {totalStories} séries sauvegardées
          </div>
        </div>

        <div style={s.headerActions}>
          <button
            style={s.headerBtn}
            onClick={() => setView?.("settings")}
          >
            <Settings2 size={15} />
          </button>

          <button
            style={s.headerBtn}
            onClick={() => setView?.("home")}
          >
            <Home size={15} />
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div style={s.searchBox}>
        <Search size={13} color="#7e8a9a" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher..."
          style={s.searchInput}
        />
      </div>

      {/* TABS */}
      <div style={s.tabs}>
        {tabs.map((tab) => {
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...s.tab,
                ...(active ? s.activeTab : {}),
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* CONTENT */}
      <div style={s.content}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + search}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {filteredList.length <= 0 ? (
              <div style={s.empty}>
                <BookOpen size={34} color="#4b5563" />

                <div style={s.emptyTitle}>
                  Bibliothèque vide
                </div>

                <div style={s.emptyText}>
                  Les séries sauvegardées apparaîtront ici.
                </div>
              </div>
            ) : (
              <div style={s.list}>
                {filteredList.map((item, index) => {
                  const globalInfo =
                    COMICCRAFTE_STORIES.find(
                      (s) =>
                        s.id?.toLowerCase() ===
                        item.id?.toLowerCase()
                    ) ||
                    FABLES_DATABASE.find(
                      (s) =>
                        s.id?.toLowerCase() ===
                        item.id?.toLowerCase()
                    );

                  const cover =
                    globalInfo?.coverImage ||
                    globalInfo?.cover ||
                    item.image ||
                    "https://via.placeholder.com/300x400";

                  return (
                    <motion.div
                      key={item.id || index}
                      style={s.card}
                      whileTap={{ scale: 0.985 }}
                    >
                      {/* COVER */}
                      <div
                        style={s.coverWrapper}
                        onClick={() => openReader(item)}
                      >
                        <img
                          src={cover}
                          alt={item.title}
                          style={s.cover}
                          loading="lazy"
                          draggable={false}
                        />

                        <div style={s.overlay} />

                        {activeTab === "downloads" && (
                          <div style={s.offlineBadge}>
                            {downloadingId === item.id ? (
                              <Loader2
                                size={10}
                                className="animate-spin"
                              />
                            ) : (
                              <>
                                <CloudCheck size={9} />
                                Offline
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* INFO */}
                      <div
                        style={s.info}
                        onClick={() => openReader(item)}
                      >
                        <div style={s.storyTitle}>
                          {item.title ||
                            globalInfo?.title}
                        </div>

                        <div style={s.meta}>
                          {item.chapter || "Chapitre 1"}
                        </div>

                        <div style={s.bottom}>
                          <div style={s.readBtn}>
                            Lire
                            <ChevronRight size={11} />
                          </div>

                          <div style={s.miniStats}>
                            ⭐ 4.9
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div style={s.sideActions}>
                        <button
                          style={s.actionBtn}
                        >
                          <MoreHorizontal size={13} />
                        </button>

                        <button
                          style={s.deleteBtn}
                          onClick={() => handleDelete(item)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* UNDO */}
      <AnimatePresence>
        {showUndo && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            style={s.undo}
          >
            <span>Série supprimée</span>

            <button
              onClick={handleUndo}
              style={s.undoBtn}
            >
              Annuler
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const s = {
  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(to bottom,#05070d,#070b14)",
    color: "#fff",
    position: "relative",
    overflow: "hidden",
    paddingBottom: "95px",
    fontFamily: "'Inter', sans-serif",
  },

  glowTop: {
    position: "absolute",
    top: "-120px",
    left: "-120px",
    width: "240px",
    height: "240px",
    background: "#00d9ff",
    filter: "blur(120px)",
    opacity: 0.12,
  },

  glowBottom: {
    position: "absolute",
    bottom: "-140px",
    right: "-140px",
    width: "260px",
    height: "260px",
    background: "#7b61ff",
    filter: "blur(140px)",
    opacity: 0.14,
  },

  header: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    padding: "14px 14px 10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backdropFilter: "blur(20px)",
    background: "rgba(5,7,13,0.72)",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 9px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.05)",
    fontSize: "8px",
    fontWeight: "800",
    color: "#d7dee9",
    marginBottom: "8px",
  },

  title: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "900",
    letterSpacing: "-0.6px",
  },

  subtitle: {
    marginTop: "3px",
    color: "#7e8a9a",
    fontSize: "11px",
  },

  headerActions: {
    display: "flex",
    gap: "7px",
  },

  headerBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.05)",
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  searchBox: {
    margin: "6px 14px 12px",
    height: "44px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "0 13px",
  },

  searchInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    fontSize: "12px",
  },

  tabs: {
    display: "flex",
    gap: "7px",
    overflowX: "auto",
    padding: "0 14px 12px",
    scrollbarWidth: "none",
  },

  tab: {
    height: "34px",
    padding: "0 12px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.05)",
    background: "rgba(255,255,255,0.03)",
    color: "#7e8a9a",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "10px",
    fontWeight: "800",
    whiteSpace: "nowrap",
    cursor: "pointer",
  },

  activeTab: {
    color: "#fff",
    background:
      "linear-gradient(90deg, rgba(0,217,255,0.16), rgba(123,97,255,0.18))",
    border: "1px solid rgba(0,217,255,0.16)",
    boxShadow: "0 0 18px rgba(0,217,255,0.08)",
  },

  content: {
    padding: "0 14px",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "9px",
  },

  card: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "9px",
    borderRadius: "18px",
    background: "rgba(11,14,20,0.96)",
    border: "1px solid rgba(255,255,255,0.05)",
    backdropFilter: "blur(18px)",
  },

  coverWrapper: {
    width: "68px",
    minWidth: "68px",
    height: "98px",
    borderRadius: "13px",
    overflow: "hidden",
    position: "relative",
    cursor: "pointer",
  },

  cover: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    userSelect: "none",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.45), transparent)",
  },

  offlineBadge: {
    position: "absolute",
    bottom: "6px",
    left: "6px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "3px 6px",
    borderRadius: "999px",
    background: "#00d9ff",
    color: "#000",
    fontSize: "7px",
    fontWeight: "900",
  },

  info: {
    flex: 1,
    minWidth: 0,
    cursor: "pointer",
  },

  storyTitle: {
    fontSize: "12px",
    fontWeight: "800",
    marginBottom: "5px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  meta: {
    fontSize: "10px",
    color: "#8a94a6",
    marginBottom: "10px",
  },

  bottom: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  readBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "3px",
    color: "#00d9ff",
    fontSize: "10px",
    fontWeight: "800",
  },

  miniStats: {
    fontSize: "9px",
    color: "#facc15",
    fontWeight: "700",
  },

  sideActions: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  actionBtn: {
    width: "30px",
    height: "30px",
    borderRadius: "10px",
    border: "none",
    background: "rgba(255,255,255,0.04)",
    color: "#8a94a6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  deleteBtn: {
    width: "30px",
    height: "30px",
    borderRadius: "10px",
    border: "none",
    background: "rgba(255,70,70,0.08)",
    color: "#ff6b6b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  empty: {
    height: "60vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: "10px",
  },

  emptyTitle: {
    fontSize: "15px",
    fontWeight: "800",
  },

  emptyText: {
    maxWidth: "220px",
    fontSize: "11px",
    lineHeight: 1.6,
    color: "#7e8a9a",
  },

  undo: {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "12px 15px",
    borderRadius: "16px",
    background:
      "linear-gradient(90deg,#00d9ff,#7b61ff)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    zIndex: 100,
    fontSize: "11px",
    fontWeight: "800",
    boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
  },

  undoBtn: {
    border: "none",
    background: "rgba(255,255,255,0.18)",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "9px",
    fontSize: "10px",
    fontWeight: "800",
    cursor: "pointer",
  },
};