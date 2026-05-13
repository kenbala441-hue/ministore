import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Eye,
  Heart,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import { COMICCRAFTE_STORIES as storiesAction } from "../../../data/Action";

export default function ComicCrafteVertical({
  setView,
  setSelectedStory,
  neonColor = "#00f7ff",
}) {
  const [visibleCount, setVisibleCount] = useState(8);

  // 🔥 SAFE DATA
  const data = useMemo(() => {
    return Array.isArray(storiesAction)
      ? storiesAction
      : [];
  }, []);

  const visibleStories = data.slice(
    0,
    visibleCount
  );

  // 📖 OPEN STORY
  const handleOpen = (story) => {
    if (!story) return;

    const storyForReader = {
      ...story,
      source: "comicrafte",
      chapters: story.chapters
        ? story.chapters
        : story.pages
        ? [
            {
              title: "Chapitre 1",
              pages: story.pages,
            },
          ]
        : [],
    };

    setSelectedStory?.(storyForReader);
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

  if (!data.length) {
    return (
      <div style={s.emptyBox}>
        <h3 style={s.emptyTitle}>
          🚧 Histoires bientôt disponibles
        </h3>

        <p style={s.emptyText}>
          De nouvelles séries premium seront
          bientôt ajoutées sur ComicCrafte.
        </p>
      </div>
    );
  }

  return (
    <section style={s.container}>
      {/* HEADER */}
      <div style={s.header}>
        <div
          style={{
            ...s.accent,
            background: neonColor,
            boxShadow: `0 0 15px ${neonColor}`,
          }}
        />

        <div style={s.headerText}>
          <h2 style={s.title}>
            ⚡ ComicCrafte Premium
          </h2>

          <p style={s.subtitle}>
            Histoires tendances & exclusives
          </p>
        </div>
      </div>

      {/* STORIES */}
      <div style={s.list}>
        {visibleStories.map((item, index) => (
          <motion.div
            key={item.id || index}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOpen(item)}
            style={s.card}
          >
            {/* IMAGE */}
            <div style={s.imageWrapper}>
              <img
                src={item.coverImage}
                alt={item.title}
                loading="lazy"
                style={s.thumb}
              />

              {/* OVERLAY */}
              <div style={s.overlay} />

              {/* RANK */}
              <div style={s.rank}>
                #{index + 1}
              </div>

              {/* NEW */}
              {index < 3 && (
                <div style={s.newBadge}>
                  <Sparkles size={8} />
                  NEW
                </div>
              )}
            </div>

            {/* INFOS */}
            <div style={s.info}>
              {/* TOP */}
              <div style={s.top}>
                <span
                  style={{
                    ...s.genre,
                    color: neonColor,
                  }}
                >
                  {item.genres?.[0] ||
                    "Fantasy"}
                </span>

                {item.isOriginal && (
                  <div style={s.original}>
                    ORIGINAL
                  </div>
                )}
              </div>

              {/* TITLE */}
              <div style={s.titleBox}>
                {item.title}
              </div>

              {/* DESC */}
              <div style={s.desc}>
                {item.description
                  ?.substring(0, 52)
                  ?.trim() ||
                  "Une aventure mystérieuse commence..."}
                ...
              </div>

              {/* FOOTER */}
              <div style={s.bottom}>
                <div style={s.stats}>
                  <span style={s.stat}>
                    <Eye size={10} />
                    {item.viewsCount ||
                      "2.4k"}
                  </span>

                  <span style={s.stat}>
                    <Heart size={10} />
                    {item.likesCount ||
                      "890"}
                  </span>
                </div>

                <div
                  style={{
                    ...s.readBtn,
                    borderColor: neonColor,
                  }}
                >
                  Lire
                  <ChevronRight size={12} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MORE */}
      <div style={s.moreWrapper}>
        {visibleCount < data.length ? (
          <button
            onClick={() =>
              setVisibleCount((prev) => prev + 6)
            }
            style={{
              ...s.moreBtn,
              borderColor: neonColor,
            }}
          >
            Voir plus
          </button>
        ) : (
          <button
            onClick={() => setVisibleCount(8)}
            style={{
              ...s.moreBtn,
              opacity: 0.7,
            }}
          >
            Voir moins
          </button>
        )}
      </div>
    </section>
  );
}

/* =========================
   🌌 PREMIUM REVOLUTION UI
========================= */

const s = {
  container: {
    padding: "0 12px",
    marginTop: 12,
  },

  /* HEADER */

  header: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },

  accent: {
    width: 4,
    height: 24,
    borderRadius: 999,
  },

  headerText: {
    display: "flex",
    flexDirection: "column",
  },

  title: {
    color: "#fff",
    fontSize: 15,
    fontWeight: 900,
    margin: 0,
  },

  subtitle: {
    color: "#666",
    fontSize: 10,
    marginTop: 2,
  },

  /* LIST */

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  /* CARD */

  card: {
    display: "flex",
    height: 92,

    borderRadius: 18,

    overflow: "hidden",

    background:
      "linear-gradient(135deg,#0f0f0f,#080808)",

    border:
      "1px solid rgba(255,255,255,0.05)",

    backdropFilter: "blur(10px)",

    boxShadow:
      "0 8px 24px rgba(0,0,0,0.35)",

    cursor: "pointer",

    transition: "0.2s ease",
  },

  /* IMAGE */

  imageWrapper: {
    width: 82,
    minWidth: 82,
    height: "100%",
    position: "relative",
    overflow: "hidden",
    background: "#111",
  },

  thumb: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.65), transparent)",
  },

  rank: {
    position: "absolute",
    top: 6,
    left: 6,

    padding: "2px 6px",

    borderRadius: 999,

    background:
      "rgba(0,0,0,0.6)",

    backdropFilter: "blur(10px)",

    color: "#fff",
    fontSize: 8,
    fontWeight: 900,
  },

  newBadge: {
    position: "absolute",
    bottom: 6,
    left: 6,

    display: "flex",
    alignItems: "center",
    gap: 3,

    padding: "3px 6px",

    borderRadius: 999,

    background:
      "linear-gradient(135deg,#00ffe1,#0077ff)",

    color: "#000",

    fontSize: 7,
    fontWeight: 900,
  },

  /* INFO */

  info: {
    flex: 1,
    padding: "8px 10px",

    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",

    minWidth: 0,
  },

  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  genre: {
    fontSize: 8,
    fontWeight: 900,
    textTransform: "uppercase",
  },

  original: {
    fontSize: 7,

    fontWeight: 900,

    padding: "3px 6px",

    borderRadius: 999,

    background:
      "linear-gradient(135deg,#8b5cf6,#d946ef)",

    color: "#fff",
  },

  titleBox: {
    color: "#fff",

    fontSize: 12,

    fontWeight: 800,

    lineHeight: 1.25,

    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",

    overflow: "hidden",
  },

  desc: {
    color: "#6f6f6f",

    fontSize: 9,

    lineHeight: 1.35,

    display: "-webkit-box",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",

    overflow: "hidden",
  },

  /* FOOTER */

  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  stats: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  stat: {
    display: "flex",
    alignItems: "center",
    gap: 3,

    color: "#777",

    fontSize: 8.5,

    fontWeight: 700,
  },

  readBtn: {
    display: "flex",
    alignItems: "center",
    gap: 2,

    padding: "5px 10px",

    borderRadius: 999,

    border: "1px solid",

    background:
      "rgba(255,255,255,0.04)",

    color: "#fff",

    fontSize: 9,

    fontWeight: 800,

    backdropFilter: "blur(10px)",
  },

  /* MORE */

  moreWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: 14,
    marginBottom: 6,
  },

  moreBtn: {
    border: "1px solid rgba(255,255,255,0.1)",

    background:
      "rgba(255,255,255,0.03)",

    color: "#fff",

    padding: "10px 20px",

    borderRadius: 999,

    fontSize: 11,

    fontWeight: 800,

    backdropFilter: "blur(10px)",

    cursor: "pointer",
  },

  /* EMPTY */

  emptyBox: {
    margin: 12,
    padding: 20,

    borderRadius: 20,

    background:
      "linear-gradient(135deg,#101010,#090909)",

    border:
      "1px solid rgba(255,255,255,0.05)",

    textAlign: "center",
  },

  emptyTitle: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 6,
  },

  emptyText: {
    color: "#666",
    fontSize: 11,
    lineHeight: 1.5,
  },
};