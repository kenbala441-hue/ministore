import React from "react";
import { motion } from "framer-motion";
import {
  Crown,
  Flame,
  TrendingUp,
  ChevronRight,
  Eye,
  Star,
} from "lucide-react";

const RankingSection = ({ onSelectStory }) => {
  const stories = [
    {
      id: 1,
      title: "Les Héritiers de l'Oubli",
      author: "ComicCrafte",
      stats: "98%",
      views: "1.2M",
      img: "https://res.cloudinary.com/dn9c4ctav/image/upload/v1772150811/1762552814369_tdmwse.png",
    },

    {
      id: 2,
      title: "Blackline",
      author: "ComicCrafte",
      stats: "92%",
      views: "874K",
      img: "https://res.cloudinary.com/dn9c4ctav/image/upload/v1774630505/1774630494659_gzve7l.png",
    },
  ];

  return (
    <section style={s.container}>
      {/* HEADER */}
      <div style={s.header}>
        <div>
          <div style={s.topMini}>
            <TrendingUp size={10} />
            <span>RANKING</span>
          </div>

          <h2 style={s.title}>
            Tendances{" "}
            <span style={s.accent}>Classement</span>
          </h2>
        </div>

        <div style={s.liveBadge}>
          <Flame size={10} />
          <span>TOP</span>
        </div>
      </div>

      {/* LIST */}
      <div style={s.list}>
        {stories.map((story, i) => (
          <motion.div
            key={story.id}
            style={s.card}
            onClick={() => onSelectStory(story)}
            whileHover={{
              scale: 1.01,
              borderColor: "rgba(122,92,255,0.25)",
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.06,
              duration: 0.25,
            }}
          >
            {/* RANK */}
            <div
              style={{
                ...s.rankBox,
                color:
                  i === 0
                    ? "#ffd54f"
                    : i === 1
                    ? "#c4b5fd"
                    : "#94a3b8",
              }}
            >
              {i === 0 ? (
                <Crown size={14} />
              ) : (
                <span>0{i + 1}</span>
              )}
            </div>

            {/* IMAGE */}
            <div style={s.imageWrapper}>
              <img
                src={story.img}
                alt={story.title}
                style={s.cover}
              />

              <div style={s.overlay} />
            </div>

            {/* INFO */}
            <div style={s.info}>
              <div style={s.storyName}>
                {story.title}
              </div>

              <div style={s.author}>
                @{story.author}
              </div>

              <div style={s.metaRow}>
                <div style={s.meta}>
                  <Eye size={9} />
                  <span>{story.views}</span>
                </div>

                <div style={s.meta}>
                  <Star size={9} />
                  <span>{story.stats}</span>
                </div>
              </div>
            </div>

            {/* SCORE */}
            <div style={s.right}>
              <div style={s.score}>
                {story.stats}
              </div>

              <ChevronRight size={15} color="#7c89a6" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RankingSection;

const s = {
  container: {
    padding: "14px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
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
    color: "#fff",
    fontSize: "17px",
    fontWeight: "900",
    margin: 0,
    lineHeight: 1.2,
  },

  accent: {
    background: "linear-gradient(90deg,#00e0ff,#7a5cff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  liveBadge: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "rgba(255,140,0,0.08)",
    border: "1px solid rgba(255,140,0,0.15)",
    color: "#ffb84d",
    fontSize: "8px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  card: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(8,10,18,0.96)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "18px",
    padding: "10px",
    transition: "0.25s",
    cursor: "pointer",
    backdropFilter: "blur(14px)",
  },

  rankBox: {
    width: "30px",
    minWidth: "30px",
    height: "30px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
    border: "1px solid rgba(255,255,255,0.05)",
    fontSize: "11px",
    fontWeight: "900",
  },

  imageWrapper: {
    width: "52px",
    minWidth: "52px",
    height: "70px",
    borderRadius: "12px",
    overflow: "hidden",
    position: "relative",
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
      "linear-gradient(to top, rgba(5,7,13,0.4), transparent)",
  },

  info: {
    flex: 1,
    minWidth: 0,
  },

  storyName: {
    color: "#fff",
    fontSize: "12px",
    fontWeight: "800",
    lineHeight: 1.3,
    marginBottom: "3px",
  },

  author: {
    color: "rgba(255,255,255,0.45)",
    fontSize: "9px",
    marginBottom: "7px",
  },

  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  meta: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    color: "#94a3b8",
    fontSize: "8px",
    fontWeight: "700",
  },

  right: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "6px",
  },

  score: {
    padding: "5px 8px",
    borderRadius: "999px",
    background:
      "linear-gradient(90deg, rgba(0,224,255,0.12), rgba(122,92,255,0.12))",
    border: "1px solid rgba(255,255,255,0.05)",
    color: "#fff",
    fontSize: "8px",
    fontWeight: "800",
  },
};