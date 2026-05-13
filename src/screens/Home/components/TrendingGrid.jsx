import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Eye,
  Heart,
  Crown,
  Sparkles
} from "lucide-react";

import { PUBLIC_STORIES } from "../../../data/publicStories";
import { COMICCRAFTE_STORIES } from "../../../data/Action";

/**
 * TRENDING GRID ULTRA COMPACT
 * ✔ 4 à 5 cartes par ligne
 * ✔ ultra fluide mobile
 * ✔ design premium minimal
 * ✔ économie d’espace
 * ✔ skeleton + fallback
 * ✔ badges modernes
 * ✔ animations légères
 * ✔ texte réduit
 */

export default function TrendingGrid({
  setView,
  setSelectedStory,
  stories = [],
  type = "public",
  neonColor = "#00f7ff"
}) {

  // =========================
  // SAFE DATA
  // =========================
  const data = useMemo(() => {
    const source =
      Array.isArray(stories) && stories.length > 0
        ? stories
        : type === "comicrafte"
        ? COMICCRAFTE_STORIES
        : PUBLIC_STORIES;

    if (!Array.isArray(source)) return [];

    return source.slice(0, 20);
  }, [stories, type]);

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
  if (!data.length) {
    return (
      <div style={s.emptyBox}>
        <Sparkles size={15} />
        <span>
          Les nouvelles histoires arrivent bientôt
        </span>
      </div>
    );
  }

  return (
    <div style={s.container}>

      {/* ================= HEADER ================= */}
      <div style={s.header}>

        <div style={s.headerLeft}>
          <div
            style={{
              ...s.accent,
              background: neonColor
            }}
          />

          <h3 style={s.title}>
            {type === "comicrafte"
              ? "ComicCrafte Originals"
              : "Trending"}
          </h3>
        </div>

        <div style={s.liveBadge}>
          <Flame size={10} />
          HOT
        </div>

      </div>

      {/* ================= GRID ================= */}
      <div style={s.grid}>

        {data.map((story, index) => {

          const cover =
            story?.coverImage ||
            story?.cover ||
            "https://via.placeholder.com/300x450/111/222?text=Story";

          return (
            <motion.div
              key={story?.id || index}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.15 }}
              style={s.card}
              onClick={() => openStory(story)}
            >

              {/* IMAGE */}
              <div style={s.imageBox}>

                <img
                  src={cover}
                  alt={story?.title}
                  loading="lazy"
                  style={s.image}
                />

                {/* OVERLAY */}
                <div style={s.overlay} />

                {/* TOP BADGE */}
                {index < 3 && (
                  <div
                    style={{
                      ...s.rank,
                      background: neonColor
                    }}
                  >
                    <Crown size={9} />
                    #{index + 1}
                  </div>
                )}

                {/* ORIGINAL */}
                {(story?.isOriginal || type === "comicrafte") && (
                  <div style={s.original}>
                    ORIGINAL
                  </div>
                )}

              </div>

              {/* INFO */}
              <div style={s.info}>

                {/* TITLE */}
                <div style={s.storyTitle}>
                  {story?.title || "Projet"}
                </div>

                {/* STATS */}
                <div style={s.stats}>

                  <span style={s.stat}>
                    <Eye size={9} />
                    {story?.viewsCount || story?.views || "0"}
                  </span>

                  <span style={s.stat}>
                    <Heart size={9} />
                    {story?.likesCount || "0"}
                  </span>

                </div>

              </div>

            </motion.div>
          );
        })}
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
    padding: "8px 10px 2px"
  },

  /* HEADER */

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },

  accent: {
    width: "3px",
    height: "14px",
    borderRadius: "10px"
  },

  title: {
    color: "#fff",
    fontSize: "13px",
    fontWeight: "800",
    margin: 0,
    letterSpacing: "0.3px"
  },

  liveBadge: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "8px",
    fontWeight: "900",
    color: "#ff8833",
    background: "rgba(255,136,51,0.08)",
    padding: "4px 7px",
    borderRadius: "20px"
  },

  /* GRID */

  grid: {
    display: "grid",

    // 4-5 histoires par ligne
    gridTemplateColumns: "repeat(auto-fill,minmax(72px,1fr))",

    gap: "9px"
  },

  /* CARD */

  card: {
    width: "100%",
    cursor: "pointer"
  },

  imageBox: {
    position: "relative",
    width: "100%",
    aspectRatio: "0.72",
    overflow: "hidden",
    borderRadius: "12px",
    background: "#111"
  },

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
      "linear-gradient(to top, rgba(0,0,0,0.7), transparent 45%)"
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
    fontSize: "8px",
    fontWeight: "900",
    color: "#000"
  },

  original: {
    position: "absolute",
    bottom: "5px",
    right: "5px",
    fontSize: "6px",
    fontWeight: "900",
    color: "#fff",
    padding: "3px 5px",
    borderRadius: "10px",
    background: "rgba(0,0,0,0.65)",
    backdropFilter: "blur(6px)"
  },

  /* INFO */

  info: {
    marginTop: "5px"
  },

  storyTitle: {
    color: "#f5f5f5",
    fontSize: "9px",
    fontWeight: "700",
    lineHeight: "1.2",

    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",

    minHeight: "22px"
  },

  stats: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "4px"
  },

  stat: {
    display: "flex",
    alignItems: "center",
    gap: "3px",
    color: "#777",
    fontSize: "8px",
    fontWeight: "700"
  },

  /* EMPTY */

  emptyBox: {
    margin: "20px 10px",
    borderRadius: "14px",
    background: "#111",
    padding: "16px",
    color: "#777",
    fontSize: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  }
};