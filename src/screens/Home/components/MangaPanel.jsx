import React from "react";
import { motion } from "framer-motion";
import {
  Eye,
  BookOpen,
  Sparkles,
  Star,
  Flame
} from "lucide-react";

export default function MangaPanel({
  story,
  onClick,
}) {
  if (!story) return null;

  const views = story.views?.toLocaleString() || "0";
  const chapters = story.chapters?.length || 1;

  return (
    <motion.div
      whileHover={{
        y: -8,
      }}
      whileTap={{
        scale: 0.97,
      }}
      transition={{
        duration: 0.25,
      }}
      style={s.card}
      onClick={() => onClick?.(story)}
    >
      {/* IMAGE */}
      <div style={s.coverBox}>
        <img
          src={
            story.coverImage ||
            story.cover ||
            "/placeholder.jpg"
          }
          alt={story.title}
          loading="lazy"
          style={s.cover}
        />

        <div style={s.overlay} />
        <div style={s.glow} />

        {/* TOP BADGES */}

        <div style={s.topBar}>
          <div style={s.chapterBadge}>
            <BookOpen size={10} />
            {chapters}
          </div>

          {story.isNew && (
            <div style={s.newBadge}>
              NEW
            </div>
          )}
        </div>

        {/* CATEGORY */}

        <div style={s.category}>
          <Sparkles size={9} />
          {story.category || "Manga"}
        </div>

        {/* HOT */}

        {(story.views || 0) > 1000 && (
          <div style={s.hotBadge}>
            <Flame size={8} />
            HOT
          </div>
        )}
      </div>

      {/* INFOS */}

      <div style={s.info}>
        <h3 style={s.title}>
          {story.title}
        </h3>

        <p style={s.author}>
          {story.author || "ComicCrafte Studio"}
        </p>

        <div style={s.stats}>
          <div style={s.stat}>
            <Eye size={11} />
            {views}
          </div>

          <div style={s.stat}>
            <Star size={11} />
            {story.rating || "4.9"}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const s = {
  card: {
    width: "100%",
    overflow: "hidden",

    borderRadius: 22,

    background:
      "linear-gradient(180deg,#121212,#090909)",

    border:
      "1px solid rgba(255,255,255,.06)",

    boxShadow:
      "0 15px 40px rgba(0,0,0,.45)",

    backdropFilter:
      "blur(12px)",

    cursor: "pointer",
  },

  coverBox: {
    position: "relative",
    width: "100%",
    aspectRatio: "0.68",
    overflow: "hidden",
  },

  cover: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,.92), transparent 55%)",
  },

  glow: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,255,225,.08), transparent)",
  },

  topBar: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    display: "flex",
    justifyContent: "space-between",
  },

  chapterBadge: {
    display: "flex",
    alignItems: "center",
    gap: 4,

    padding: "5px 10px",

    borderRadius: 999,

    background:
      "rgba(0,0,0,.65)",

    backdropFilter:
      "blur(10px)",

    color: "#fff",

    fontSize: 9,

    fontWeight: 900,
  },

  newBadge: {
    padding: "5px 10px",

    borderRadius: 999,

    background:
      "linear-gradient(135deg,#00ffe1,#0077ff)",

    color: "#000",

    fontSize: 8,

    fontWeight: 900,

    boxShadow:
      "0 0 15px rgba(0,255,225,.4)",
  },

  hotBadge: {
    position: "absolute",

    top: 45,
    right: 10,

    display: "flex",
    alignItems: "center",
    gap: 4,

    padding: "4px 8px",

    borderRadius: 999,

    background:
      "rgba(255,90,90,.9)",

    color: "#fff",

    fontSize: 8,

    fontWeight: 900,
  },

  category: {
    position: "absolute",

    bottom: 10,
    left: 10,

    display: "flex",
    alignItems: "center",
    gap: 4,

    padding: "5px 10px",

    borderRadius: 999,

    background:
      "rgba(0,0,0,.65)",

    backdropFilter:
      "blur(10px)",

    border:
      "1px solid rgba(0,255,225,.15)",

    color: "#00ffe1",

    fontSize: 8,

    fontWeight: 900,

    textTransform: "uppercase",
  },

  info: {
    padding: 14,
  },

  title: {
    color: "#fff",

    fontSize: 13,

    fontWeight: 800,

    lineHeight: 1.4,

    margin: 0,

    minHeight: 38,

    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  author: {
    color: "#777",
    fontSize: 10,
    marginTop: 5,
    marginBottom: 12,
  },

  stats: {
    display: "flex",
    gap: 8,
  },

  stat: {
    display: "flex",
    alignItems: "center",
    gap: 4,

    padding: "6px 10px",

    borderRadius: 999,

    background:
      "rgba(255,255,255,.04)",

    border:
      "1px solid rgba(255,255,255,.05)",

    color: "#aaa",

    fontSize: 9,

    fontWeight: 700,
  },
};