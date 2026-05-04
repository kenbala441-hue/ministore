import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { PUBLIC_STORIES } from "../../../data/publicStories";

export default function SaisonScroll({
  title = "🔥 Recommandé",
  filter = "recent",
  genre = null,
  setView,
  setSelectedStory
}) {

  // 🔥 DATA SAFE + TRI
  const displayData = useMemo(() => {
    let data = Array.isArray(PUBLIC_STORIES) ? [...PUBLIC_STORIES] : [];
    if (!data.length) return [];

    if (filter === "genre" && genre) {
      data = data.filter(s => s?.genres?.includes(genre));
    }

    if (filter === "popular") {
      data.sort((a, b) => (b?.viewsCount || 0) - (a?.viewsCount || 0));
    }

    if (filter === "recent") {
      data = [...data].reverse();
    }

    return data.slice(0, 12);
  }, [filter, genre]);

  if (!displayData.length) {
    return <div style={styles.empty}>Aucune histoire disponible</div>;
  }

  const openStory = (story) => {
    if (!story) return;
    setSelectedStory?.(story);
    setView?.("reader");
  };

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <h3 style={styles.title}>{title}</h3>

        <span style={styles.link} onClick={() => setView?.("news")}>
          VOIR +
        </span>
      </div>

      {/* HORIZONTAL SCROLL WEBTOON */}
      <div style={styles.scroll}>
        {displayData.map((story, index) => (
          <motion.div
            key={story?.id || index}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            style={styles.card}
            onClick={() => openStory(story)}
          >

            {/* IMAGE */}
            <div style={styles.imageBox}>
              <img
                src={story?.coverImage || "https://via.placeholder.com/300x450"}
                alt={story?.title}
                style={styles.image}
                loading="lazy"
              />

              {/* RANK */}
              {filter === "popular" && index < 3 && (
                <div style={styles.rank}>#{index + 1}</div>
              )}

              <div style={styles.overlay} />
            </div>

            {/* TEXT */}
            <div style={styles.info}>
              <div style={styles.titleCard}>
                {story?.title}
              </div>

              <div style={styles.genre}>
                {story?.genres?.[0] || "Story"}
              </div>

              <div style={styles.stats}>
                👁 {story?.viewsCount || 0} · ❤️ {story?.likesCount || 0}
              </div>
            </div>

          </motion.div>
        ))}
      </div>

    </div>
  );
}

/* ================= STYLE WEBTOON PRO ================= */

const styles = {
  container: {
    padding: "15px 0",
    color: "#fff"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0 15px",
    marginBottom: "10px",
    alignItems: "center"
  },

  title: {
    fontSize: "18px",
    fontWeight: "900"
  },

  link: {
    fontSize: "11px",
    color: "#00f7ff",
    fontWeight: "bold",
    cursor: "pointer"
  },

  scroll: {
    display: "flex",
    overflowX: "auto",
    gap: "10px",
    padding: "0 15px",
    scrollbarWidth: "none"
  },

  card: {
    minWidth: "120px",
    width: "120px",
    flexShrink: 0,
    cursor: "pointer"
  },

  imageBox: {
    position: "relative",
    width: "100%",
    aspectRatio: "2 / 3",
    borderRadius: "10px",
    overflow: "hidden",
    background: "#111"
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent 50%)"
  },

  rank: {
    position: "absolute",
    top: "5px",
    left: "5px",
    background: "#00f7ff",
    color: "#000",
    fontSize: "10px",
    fontWeight: "900",
    padding: "3px 6px",
    borderRadius: "6px"
  },

  info: {
    marginTop: "6px"
  },

  titleCard: {
    fontSize: "12px",
    fontWeight: "800",
    lineHeight: "1.2",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    height: "32px"
  },

  genre: {
    fontSize: "10px",
    color: "#00f7ff",
    marginTop: "2px"
  },

  stats: {
    fontSize: "9px",
    color: "#777",
    marginTop: "2px"
  },

  empty: {
    padding: "20px",
    color: "#888"
  }
};