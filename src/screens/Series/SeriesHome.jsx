// SERIES HOME V4 — WEBTOON / MANGA APP UI
// compact • premium • fluid • persistent • mobile optimized

import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  Search,
  Star,
  Flame,
  Clock3,
  Bookmark,
  TrendingUp,
  BookOpen,
  Sparkles,
  ChevronRight,
  Filter,
} from "lucide-react";

import { COMICCRAFTE_STORIES } from "../../data/COMICCRAFTE_DATA";

const STORAGE_KEY = "comicrafte_home_preferences";

export default function SeriesHome({
  setView,
  setSelectedStory,
}) {
  const [filter, setFilter] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [savedStories, setSavedStories] = useState([]);

  // =========================
  // CATEGORIES
  // =========================

  const categories = [
    {
      id: "Tous",
      icon: <Sparkles size={11} />,
    },
    {
      id: "Manga",
      icon: <Flame size={11} />,
    },
    {
      id: "Light Novel",
      icon: <Bookmark size={11} />,
    },
    {
      id: "Webtoon",
      icon: <TrendingUp size={11} />,
    },
  ];

  // =========================
  // PERSISTENCE
  // =========================

  useEffect(() => {
    try {
      const cache = localStorage.getItem(STORAGE_KEY);

      if (cache) {
        const parsed = JSON.parse(cache);

        setFilter(parsed?.filter || "Tous");
        setSearchTerm(parsed?.search || "");
      }
    } catch (err) {
      console.error(err);
    }

    try {
      const favs = JSON.parse(
        localStorage.getItem("comicrafte_favorites")
      );

      setSavedStories(favs || []);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          filter,
          search: searchTerm,
        })
      );
    } catch {}
  }, [filter, searchTerm]);

  // =========================
  // FILTER
  // =========================

  const filteredStories = useMemo(() => {
    return COMICCRAFTE_STORIES.filter((story) => {
      const matchesFilter =
        filter === "Tous" ||
        story?.type === filter;

      const matchesSearch =
        story?.title
          ?.toLowerCase()
          ?.includes(searchTerm.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [filter, searchTerm]);

  // =========================
  // OPEN STORY
  // =========================

  const openStory = useCallback(
    (story) => {
      if (!story) return;

      try {
        localStorage.setItem(
          "comicrafte_last_story",
          JSON.stringify(story)
        );
      } catch {}

      setSelectedStory?.(story);
      setView?.("details");
    },
    [setSelectedStory, setView]
  );

  // =========================
  // SAVE STORY
  // =========================

  const toggleSave = (story, e) => {
    e.stopPropagation();

    try {
      let updated = [...savedStories];

      const exists = updated.find(
        (s) => s.id === story.id
      );

      if (exists) {
        updated = updated.filter(
          (s) => s.id !== story.id
        );
      } else {
        updated.unshift(story);
      }

      setSavedStories(updated);

      localStorage.setItem(
        "comicrafte_favorites",
        JSON.stringify(updated)
      );
    } catch {}
  };

  // =========================
  // UI
  // =========================

  return (    <div style={s.container}>
      {/* BG EFFECTS */}
      <div style={s.glowTop} />
      <div style={s.glowBottom} />

      {/* HEADER */}
      <div style={s.header}>
        {/* Conteneur gauche : Badge, Titre et sous-titre */}
        <div style={{ flex: 1 }}>
          <div style={s.badge}>
            <Sparkles size={9} />
            <span>COMICCRAFTE SERIES</span>
          </div>

          <h1 style={s.title}>Découvrir</h1>
          
          <div style={s.subtitle}>
            {filteredStories.length} séries disponibles
          </div>
        </div>

        {/* Conteneur droite : Boutons (Bibliothèque + Filtre) */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {/* Bouton Bibliothèque */}
          <button 
            onClick={() => setView("myseries")} 
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              padding: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <BookOpen size={20} color="#00e5ff" />
          </button>

          {/* Bouton Filtre */}
          <button style={s.filterButton}>
            <Filter size={15} />
          </button>
        </div>
      </div>


      {/* SEARCH */}
      <div style={s.searchSection}>
        <div style={s.searchBar}>
          <Search size={14} color="#7f8b9c" />

          <input
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            placeholder="Rechercher une série..."
            style={s.input}
          />
        </div>
      </div>

      {/* FILTERS */}
      <div style={s.filterRow}>
        {categories.map((cat) => {
          const active = filter === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              style={{
                ...s.filterBtn,
                ...(active
                  ? s.activeFilter
                  : {}),
              }}
            >
              {cat.icon}
              {cat.id}
            </button>
          );
        })}
      </div>

      {/* GRID */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter + searchTerm}
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.2,
          }}
          style={s.grid}
        >
          {filteredStories.map((story, index) => {
            const isSaved = savedStories.some(
              (s) => s.id === story.id
            );

            return (
              <motion.div
                key={story.id || index}
                whileTap={{
                  scale: 0.97,
                }}
                style={s.card}
                onClick={() =>
                  openStory(story)
                }
              >
                {/* COVER */}
                <div style={s.imageContainer}>
                  <img
                    src={
                      story.cover ||
                      story.coverImage
                    }
                    alt={story.title}
                    style={s.cover}
                    loading="lazy"
                    draggable={false}
                  />

                  <div style={s.overlay} />

                  {/* TYPE */}
                  <div style={s.badgeType}>
                    {story.type || "Story"}
                  </div>

                  {/* SAVE */}
                  <button
                    onClick={(e) =>
                      toggleSave(story, e)
                    }
                    style={{
                      ...s.saveBtn,
                      ...(isSaved
                        ? s.savedBtn
                        : {}),
                    }}
                  >
                    <Bookmark
                      size={11}
                      fill={
                        isSaved
                          ? "#fff"
                          : "transparent"
                      }
                    />
                  </button>
                </div>

                {/* INFO */}
                <div style={s.info}>
                  <div style={s.storyTitle}>
                    {story.title}
                  </div>

                  <div style={s.meta}>
                    <div style={s.rating}>
                      <Star
                        size={10}
                        fill="#ffd84d"
                      />
                      4.9
                    </div>

                    <div style={s.chapter}>
                      <Clock3 size={10} />
                      {story?.chapters
                        ?.length || 0}{" "}
                      Ch.
                    </div>
                  </div>

                  <div style={s.bottomRow}>
                    <div style={s.readBtn}>
                      Lire
                      <ChevronRight
                        size={11}
                      />
                    </div>

                    <div style={s.views}>
                      1.2M
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const s = {
  container: {
    minHeight: "100vh",
    padding: "14px",
    paddingBottom: "100px",
    background:
      "linear-gradient(to bottom,#05070d,#090f18)",
    position: "relative",
    overflow: "hidden",
    color: "#fff",
    fontFamily: "'Inter', sans-serif",
  },

  glowTop: {
    position: "absolute",
    top: "-120px",
    left: "-120px",
    width: "220px",
    height: "220px",
    background: "#00d9ff",
    filter: "blur(120px)",
    opacity: 0.12,
  },

  glowBottom: {
    position: "absolute",
    bottom: "-140px",
    right: "-140px",
    width: "240px",
    height: "240px",
    background: "#7c5cff",
    filter: "blur(140px)",
    opacity: 0.13,
  },

  header: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "14px",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 9px",
    borderRadius: "999px",
    background:
      "rgba(255,255,255,0.04)",
    border:
      "1px solid rgba(255,255,255,0.05)",
    fontSize: "8px",
    fontWeight: "800",
    color: "#d5dbe5",
    marginBottom: "8px",
  },

  title: {
    margin: 0,
    fontSize: "25px",
    fontWeight: "900",
    letterSpacing: "-0.6px",
  },

  subtitle: {
    marginTop: "3px",
    fontSize: "11px",
    color: "#7f8b9c",
  },

  filterButton: {
    width: "38px",
    height: "38px",
    borderRadius: "13px",
    border:
      "1px solid rgba(255,255,255,0.05)",
    background:
      "rgba(255,255,255,0.04)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  searchSection: {
    marginBottom: "14px",
    position: "relative",
    zIndex: 2,
  },

  searchBar: {
    height: "44px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderRadius: "15px",
    padding: "0 14px",
    background:
      "rgba(255,255,255,0.04)",
    border:
      "1px solid rgba(255,255,255,0.06)",
    backdropFilter: "blur(14px)",
  },

  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    fontSize: "12px",
  },

  filterRow: {
    display: "flex",
    gap: "8px",
    overflowX: "auto",
    marginBottom: "16px",
    scrollbarWidth: "none",
    position: "relative",
    zIndex: 2,
  },

  filterBtn: {
    height: "34px",
    padding: "0 13px",
    borderRadius: "12px",
    border:
      "1px solid rgba(255,255,255,0.05)",
    background:
      "rgba(255,255,255,0.03)",
    color: "#7f8b9c",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "10px",
    fontWeight: "800",
    whiteSpace: "nowrap",
    cursor: "pointer",
  },

  activeFilter: {
    background:
      "linear-gradient(90deg, rgba(0,217,255,0.16), rgba(124,92,255,0.18))",
    color: "#fff",
    border:
      "1px solid rgba(0,217,255,0.14)",
    boxShadow:
      "0 0 18px rgba(0,217,255,0.08)",
  },

  grid: {
    position: "relative",
    zIndex: 2,
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill,minmax(145px,1fr))",
    gap: "12px",
  },

  card: {
    background:
      "rgba(11,14,20,0.96)",
    borderRadius: "18px",
    overflow: "hidden",
    border:
      "1px solid rgba(255,255,255,0.05)",
    backdropFilter: "blur(18px)",
    cursor: "pointer",
  },

  imageContainer: {
    position: "relative",
    height: "210px",
    overflow: "hidden",
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
      "linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)",
  },

  badgeType: {
    position: "absolute",
    left: "8px",
    bottom: "8px",
    padding: "4px 7px",
    borderRadius: "999px",
    background:
      "rgba(0,0,0,0.55)",
    backdropFilter: "blur(10px)",
    color: "#00d9ff",
    fontSize: "8px",
    fontWeight: "900",
  },

  saveBtn: {
    position: "absolute",
    top: "8px",
    right: "8px",
    width: "28px",
    height: "28px",
    borderRadius: "10px",
    border: "none",
    background:
      "rgba(0,0,0,0.45)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(10px)",
  },

  savedBtn: {
    background:
      "linear-gradient(90deg,#00d9ff,#7c5cff)",
  },

  info: {
    padding: "10px",
  },

  storyTitle: {
    fontSize: "12px",
    fontWeight: "800",
    lineHeight: 1.4,
    marginBottom: "7px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  meta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },

  rating: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "10px",
    color: "#ffd84d",
    fontWeight: "700",
  },

  chapter: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "10px",
    color: "#8d97a8",
  },

  bottomRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  readBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "3px",
    color: "#00d9ff",
    fontSize: "10px",
    fontWeight: "800",
  },

  views: {
    fontSize: "9px",
    color: "#7f8b9c",
    fontWeight: "700",
  },
};