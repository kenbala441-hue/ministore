import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Eye,
  Grid2X2,
  Rows3,
  Sparkles,
  ChevronRight
} from "lucide-react";

import { PUBLIC_STORIES } from "../../../data/publicStories";

/**
 * WEBTOON VERTICAL PREMIUM
 * ✔ ultra compact
 * ✔ fluide mobile
 * ✔ scroll + grid dynamique
 * ✔ bottom bar moderne
 * ✔ animations propres
 * ✔ design minimal premium
 * ✔ optimisé performances
 */

export default function WebtoonVertical({
  title = "Recommandé",
  filter = "popular",
  genre = null,
  setView,
  setSelectedStory,
  neonColor = "#00f7ff"
}) {

  // =========================
  // MODES
  // =========================
  const [gridMode, setGridMode] = useState(false);

  // =========================
  // DATA
  // =========================
  const stories = useMemo(() => {

    let data = Array.isArray(PUBLIC_STORIES)
      ? [...PUBLIC_STORIES]
      : [];

    // FILTER GENRE
    if (filter === "genre" && genre) {
      data = data.filter(
        s => s?.genres?.includes(genre)
      );
    }

    // POPULAR
    if (filter === "popular") {
      data.sort(
        (a, b) =>
          (b?.viewsCount || 0) -
          (a?.viewsCount || 0)
      );
    }

    // RECENT
    if (filter === "recent") {
      data.reverse();
    }

    return gridMode
      ? data.slice(0, 18)
      : data.slice(0, 12);

  }, [filter, genre, gridMode]);

  // =========================
  // OPEN STORY
  // =========================
  const openStory = (story) => {

    if (!story) return;

    setSelectedStory?.(story);
    setView?.("reader");

    try {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  // =========================
  // EMPTY
  // =========================
  if (!stories.length) {
    return (
      <div style={s.empty}>
        <Sparkles size={14} />
        Les histoires arrivent bientôt
      </div>
    );
  }

  return (
    <div style={s.container}>

      {/* ================= HEADER ================= */}

      <div style={s.header}>

        {/* LEFT */}
        <div style={s.left}>

          <div
            style={{
              ...s.bar,
              background: neonColor
            }}
          />

          <div>

            <h3 style={s.title}>
              {title}
            </h3>

            <div style={s.subtitle}>
              Stories populaires
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div style={s.actions}>

          <button
            onClick={() => setGridMode(false)}
            style={{
              ...s.iconBtn,
              background: !gridMode
                ? neonColor
                : "rgba(255,255,255,0.05)"
            }}
          >
            <Rows3
              size={13}
              color={!gridMode ? "#000" : "#999"}
            />
          </button>

          <button
            onClick={() => setGridMode(true)}
            style={{
              ...s.iconBtn,
              background: gridMode
                ? neonColor
                : "rgba(255,255,255,0.05)"
            }}
          >
            <Grid2X2
              size={13}
              color={gridMode ? "#000" : "#999"}
            />
          </button>

        </div>
      </div>

      {/* ================= CONTENT ================= */}

      <motion.div
        layout
        style={
          gridMode
            ? s.grid
            : s.scroll
        }
      >

        <AnimatePresence>

          {stories.map((story, index) => (

            <motion.div
              key={story?.id || index}
              layout
              initial={{
                opacity: 0,
                scale: 0.96
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              exit={{
                opacity: 0
              }}
              transition={{
                duration: 0.18
              }}
              whileTap={{
                scale: 0.96
              }}
              style={
                gridMode
                  ? s.cardGrid
                  : s.cardScroll
              }
              onClick={() => openStory(story)}
            >

              {/* IMAGE */}

              <div
                style={
                  gridMode
                    ? s.imageGrid
                    : s.imageScroll
                }
              >

                <img
                  src={
                    story?.coverImage ||
                    "https://via.placeholder.com/300x450/111/222?text=Story"
                  }
                  alt={story?.title}
                  loading="lazy"
                  style={s.image}
                />

                {/* OVERLAY */}
                <div style={s.overlay} />

                {/* RANK */}
                {index < 3 && (
                  <div
                    style={{
                      ...s.rank,
                      background: neonColor
                    }}
                  >
                    <Flame size={8} />
                    {index + 1}
                  </div>
                )}

              </div>

              {/* INFO */}

              <div style={s.info}>

                <div style={s.storyTitle}>
                  {story?.title || "Story"}
                </div>

                <div style={s.metaRow}>

                  <span style={s.views}>
                    <Eye size={9} />
                    {story?.viewsCount || 0}
                  </span>

                  <ChevronRight
                    size={11}
                    color="#555"
                  />

                </div>

              </div>

            </motion.div>

          ))}

        </AnimatePresence>

      </motion.div>

      {/* ================= BOTTOM BAR ================= */}

      <div style={s.bottomBar}>

        <div style={s.bottomGlow} />

        <span style={s.bottomText}>
          {stories.length} histoires affichées
        </span>

      </div>

    </div>
  );
}

/* =========================
   STYLES
========================= */

const s = {

  container: {
    width: "100%",
    margin: "12px 0 20px"
  },

  /* HEADER */

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 12px",
    marginBottom: "10px"
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },

  bar: {
    width: "3px",
    height: "16px",
    borderRadius: "20px"
  },

  title: {
    color: "#fff",
    fontSize: "13px",
    fontWeight: "800",
    margin: 0
  },

  subtitle: {
    color: "#666",
    fontSize: "9px",
    marginTop: "1px"
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },

  iconBtn: {
    width: "28px",
    height: "28px",
    border: "none",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(10px)"
  },

  /* SCROLL */

  scroll: {
    display: "flex",
    overflowX: "auto",
    gap: "10px",
    padding: "0 12px 8px",
    scrollbarWidth: "none",
    WebkitOverflowScrolling: "touch"
  },

  cardScroll: {
    flex: "0 0 92px",
    cursor: "pointer"
  },

  imageScroll: {
    width: "92px",
    height: "125px",
    borderRadius: "12px",
    overflow: "hidden",
    position: "relative",
    background: "#111"
  },

  /* GRID */

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill,minmax(78px,1fr))",
    gap: "10px",
    padding: "0 12px"
  },

  cardGrid: {
    cursor: "pointer"
  },

  imageGrid: {
    width: "100%",
    aspectRatio: "0.72",
    borderRadius: "12px",
    overflow: "hidden",
    position: "relative",
    background: "#111"
  },

  /* IMAGE */

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block"
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.65), transparent 45%)"
  },

  /* BADGES */

  rank: {
    position: "absolute",
    top: "5px",
    left: "5px",
    display: "flex",
    alignItems: "center",
    gap: "3px",
    padding: "3px 6px",
    borderRadius: "20px",
    color: "#000",
    fontSize: "8px",
    fontWeight: "900"
  },

  /* INFO */

  info: {
    marginTop: "5px"
  },

  storyTitle: {
    color: "#f2f2f2",
    fontSize: "9px",
    fontWeight: "700",
    lineHeight: "1.25",

    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",

    minHeight: "22px"
  },

  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "4px"
  },

  views: {
    display: "flex",
    alignItems: "center",
    gap: "3px",
    color: "#777",
    fontSize: "8px",
    fontWeight: "700"
  },

  /* BOTTOM BAR */

  bottomBar: {
    position: "relative",
    marginTop: "14px",
    marginInline: "12px",
    height: "32px",
    borderRadius: "14px",
    overflow: "hidden",

    background:
      "rgba(255,255,255,0.04)",

    border:
      "1px solid rgba(255,255,255,0.04)",

    backdropFilter: "blur(12px)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  bottomGlow: {
    position: "absolute",
    width: "40%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
    animation: "shine 4s linear infinite"
  },

  bottomText: {
    position: "relative",
    color: "#888",
    fontSize: "9px",
    fontWeight: "700",
    letterSpacing: "0.3px"
  },

  /* EMPTY */

  empty: {
    margin: "15px",
    padding: "14px",
    borderRadius: "14px",
    background: "#111",
    color: "#666",
    fontSize: "11px",
    textAlign: "center"
  }
};