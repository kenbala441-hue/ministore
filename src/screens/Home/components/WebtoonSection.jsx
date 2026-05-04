import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PUBLIC_STORIES } from "../../../data/publicStories";

export default function WebtoonVertical({
  title = "🔥 Recommandé",
  filter = "popular",
  genre = null,
  setView,
  setSelectedStory
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const stories = useMemo(() => {
    let data = Array.isArray(PUBLIC_STORIES) ? [...PUBLIC_STORIES] : [];

    if (filter === "genre" && genre)
      data = data.filter(s => s?.genres?.includes(genre));

    if (filter === "popular")
      data.sort((a, b) => (b?.viewsCount || 0) - (a?.viewsCount || 0));

    if (filter === "recent")
      data = [...data].reverse();

    return isExpanded ? data : data.slice(0, 10);
  }, [filter, genre, isExpanded]);

  const handleOpen = (story) => {
    if (!story) return;
    setSelectedStory?.(story);
    setView?.("reader");
  };

  if (!stories.length) return null;

  return (
    <div style={s.container}>
      {/* HEADER */}
      <div style={s.header}>
        <div style={s.titleGroup}>
          <div
            style={{
              ...s.bar,
              backgroundColor: isExpanded ? "#ff003c" : "#00f7ff"
            }}
          />
          <h3 style={s.title}>{title}</h3>
        </div>

        <span style={s.link} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "RÉDUIRE" : "VOIR TOUT"}
        </span>
      </div>

      {/* CONTENT */}
      <motion.div
        layout
        style={isExpanded ? s.grid : s.scroll}
      >
        <AnimatePresence>
          {stories.map((story, index) => (
            <motion.div
              key={story?.id || index}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.96 }}
              style={isExpanded ? s.cardGrid : s.cardScroll}
              onClick={() => handleOpen(story)}
            >
              {/* IMAGE */}
              <div style={isExpanded ? s.imgGrid : s.imgScroll}>
                <img src={story?.coverImage} alt="" style={s.img} />
                <div style={s.rank}>{index + 1}</div>
              </div>

              {/* INFO */}
              <div style={s.info}>
                <div style={s.titleStory}>{story?.title}</div>
                <div style={s.meta}>★ {story?.viewsCount || 0}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

const s = {
  container: {
    margin: "15px 0",
    width: "100%"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 15px",
    marginBottom: "12px"
  },

  titleGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },

  bar: {
    width: "3px",
    height: "14px",
    borderRadius: "2px"
  },

  title: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: "900"
  },

  link: {
    fontSize: "10px",
    color: "#00f7ff",
    fontWeight: "800",
    cursor: "pointer"
  },

  /* 🔥 SCROLL MODE (IMPORTANT) */
  scroll: {
    display: "flex",
    overflowX: "auto",
    gap: "10px",
    padding: "0 15px 10px",
    WebkitOverflowScrolling: "touch"
  },

  cardScroll: {
    flex: "0 0 140px", // 🔥 CRUCIAL pour scroll
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },

  imgScroll: {
    width: "140px",
    height: "180px",
    borderRadius: "8px",
    overflow: "hidden",
    position: "relative"
  },

  /* 🔥 GRID MODE */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    padding: "0 15px"
  },

  cardGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },

  imgGrid: {
    width: "100%",
    aspectRatio: "2/3",
    borderRadius: "6px",
    overflow: "hidden",
    position: "relative"
  },

  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },

  rank: {
    position: "absolute",
    top: 0,
    left: 0,
    background: "#00f7ff",
    color: "#000",
    fontSize: "8px",
    fontWeight: "900",
    padding: "2px 6px",
    borderBottomRightRadius: "6px"
  },

  info: {
    overflow: "hidden"
  },

  titleStory: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#eee",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },

  meta: {
    fontSize: "9px",
    color: "#777"
  }
};