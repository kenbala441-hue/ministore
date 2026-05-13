import React from "react";
import { motion } from "framer-motion";
import {
  Flame,
  ChevronRight,
  Eye,
  Crown,
  Star,
} from "lucide-react";

import { PUBLIC_STORIES } from "../../../data/publicStories";

export default function TrendingScroll({
  setView,
  setSelectedStory,
}) {
  const trendingData =
    PUBLIC_STORIES.filter((s) => s.isTrending).length > 0
      ? PUBLIC_STORIES.filter((s) => s.isTrending).slice(0, 10)
      : PUBLIC_STORIES.slice(0, 10);

  const handleOpen = (story) => {
    setSelectedStory(story);
    setView("reader");
  };

  const getRank = (index) => {
    if (index === 0) {
      return {
        color: "#FFD76A",
        glow: "rgba(255,215,106,0.25)",
        icon: <Crown size={11} />,
      };
    }

    if (index === 1) {
      return {
        color: "#D8E1FF",
        glow: "rgba(216,225,255,0.18)",
      };
    }

    if (index === 2) {
      return {
        color: "#E9A86D",
        glow: "rgba(233,168,109,0.18)",
      };
    }

    return {
      color: "#9F7AEA",
      glow: "rgba(159,122,234,0.15)",
    };
  };

  return (
    <section style={s.container}>
      {/* HEADER */}
      <div style={s.header}>
        <div>
          <div style={s.topMini}>
            <Flame size={10} />
            <span>TENDANCES</span>
          </div>

          <h2 style={s.title}>
            Top <span style={s.accent}>Lectures</span>
          </h2>
        </div>

        <div
          style={s.moreBtn}
          onClick={() => setView("multiverse")}
        >
          <span>Tout voir</span>
          <ChevronRight size={13} />
        </div>
      </div>

      {/* SCROLL */}
      <div style={s.scroll}>
        {trendingData.map((story, index) => {
          const rank = getRank(index);

          return (
            <motion.div
              key={story.id || index}
              style={s.card}
              whileHover={{
                y: -3,
              }}
              transition={{ duration: 0.2 }}
              onClick={() => handleOpen(story)}
            >
              {/* IMAGE */}
              <div
                style={{
                  ...s.imageWrapper,
                  boxShadow: `0 10px 25px ${rank.glow}`,
                }}
              >
                <img
                  src={story.coverImage || story.image}
                  alt={story.title}
                  style={s.image}
                />

                {/* OVERLAY */}
                <div style={s.overlay} />

                {/* RANK */}
                <div
                  style={{
                    ...s.rankBadge,
                    color: rank.color,
                  }}
                >
                  {rank.icon ? (
                    rank.icon
                  ) : (
                    <span>0{index + 1}</span>
                  )}
                </div>

                {/* HOT */}
                {index < 3 && (
                  <div style={s.hotBadge}>
                    <Star size={8} />
                    <span>HOT</span>
                  </div>
                )}
              </div>

              {/* INFO */}
              <div style={s.info}>
                <div
                  style={{
                    ...s.storyTitle,
                    color:
                      index === 0
                        ? "#fff2bf"
                        : "#fff",
                  }}
                >
                  {story.title}
                </div>

                <div style={s.genre}>
                  {story.genre || "Manga"}
                </div>

                <div style={s.bottomRow}>
                  <div style={s.views}>
                    <Eye size={8} />
                    <span>
                      {story.views || "12K"}
                    </span>
                  </div>

                  <div
                    style={{
                      ...s.rankMini,
                      color: rank.color,
                    }}
                  >
                    #{index + 1}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

const s = {
  container: {
    marginTop: "12px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 14px",
    marginBottom: "12px",
    gap: "10px",
  },

  topMini: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "5px 9px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.05)",
    color: "#cbd5e1",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "1px",
    marginBottom: "7px",
  },

  title: {
    margin: 0,
    color: "#fff",
    fontSize: "17px",
    fontWeight: "900",
    lineHeight: 1.2,
  },

  accent: {
    background: "linear-gradient(90deg,#00e0ff,#7a5cff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  moreBtn: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    color: "#94a3b8",
    fontSize: "9px",
    fontWeight: "800",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  scroll: {
    display: "flex",
    overflowX: "auto",
    gap: "10px",
    padding: "0 14px 4px",
    scrollbarWidth: "none",
  },

  card: {
    minWidth: "102px",
    width: "102px",
    flexShrink: 0,
    cursor: "pointer",
  },

  imageWrapper: {
    width: "102px",
    height: "142px",
    borderRadius: "18px",
    overflow: "hidden",
    position: "relative",
    background: "#0a0d16",
    border: "1px solid rgba(255,255,255,0.05)",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(5,7,13,0.9), transparent 55%)",
  },

  rankBadge: {
    position: "absolute",
    left: "8px",
    bottom: "8px",
    fontSize: "18px",
    fontWeight: "900",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textShadow: "0 4px 12px rgba(0,0,0,0.45)",
  },

  hotBadge: {
    position: "absolute",
    top: "8px",
    right: "8px",
    display: "flex",
    alignItems: "center",
    gap: "3px",
    padding: "4px 6px",
    borderRadius: "999px",
    background: "rgba(255,140,0,0.12)",
    border: "1px solid rgba(255,140,0,0.18)",
    color: "#ffb84d",
    fontSize: "7px",
    fontWeight: "800",
    backdropFilter: "blur(10px)",
  },

  info: {
    marginTop: "7px",
    padding: "0 2px",
  },

  storyTitle: {
    fontSize: "10px",
    fontWeight: "800",
    lineHeight: 1.3,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  genre: {
    marginTop: "2px",
    color: "#6b7280",
    fontSize: "8px",
    fontWeight: "600",
  },

  bottomRow: {
    marginTop: "6px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "6px",
  },

  views: {
    display: "flex",
    alignItems: "center",
    gap: "3px",
    color: "#94a3b8",
    fontSize: "7px",
    fontWeight: "700",
  },

  rankMini: {
    fontSize: "8px",
    fontWeight: "900",
  },
};