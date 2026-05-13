import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Clock3,
  Lock,
  Flame,
  ChevronRight,
} from "lucide-react";

import { comingSoonStories } from "./newsData";

const TrendingNews = ({ onSelectStory }) => {
  return (
    <section style={s.container}>
      {/* HEADER */}
      <div style={s.topBar}>
        <div>
          <div style={s.topMini}>
            <Sparkles size={10} />
            <span>NOUVEAUTÉS</span>
          </div>

          <h2 style={s.title}>
            Prochainement sur{" "}
            <span style={s.titleAccent}>ComicCrafte</span>
          </h2>
        </div>
      </div>

      {/* LIST */}
      <div style={s.list}>
        {comingSoonStories.map((item, index) => {
          const delayed = item.status === "RETARDÉ";

          return (
            <motion.div
              key={item.id}
              style={s.card}
              onClick={() => onSelectStory(item)}
              whileHover={{
                scale: 1.01,
                borderColor: "rgba(122,92,255,0.25)",
              }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.04,
                duration: 0.25,
              }}
            >
              {/* IMAGE */}
              <div style={s.imageWrapper}>
                <img
                  src={item.img}
                  alt={item.title}
                  style={s.image}
                />

                <div style={s.overlay} />

                <div style={s.comingBadge}>
                  <Clock3 size={8} />
                  <span>BIENTÔT</span>
                </div>
              </div>

              {/* CONTENT */}
              <div style={s.content}>
                {/* TOP */}
                <div style={s.rowTop}>
                  <div style={s.genre}>
                    <Flame size={8} />
                    <span>{item.genre}</span>
                  </div>

                  <div
                    style={{
                      ...s.status,
                      color: delayed ? "#ff6b6b" : "#b388ff",
                    }}
                  >
                    {item.status}
                  </div>
                </div>

                {/* TITLE */}
                <h3 style={s.storyTitle}>{item.title}</h3>

                {/* DESC */}
                <p style={s.desc}>
                  {item.synopsis?.slice(0, 90)}...
                </p>

                {/* FOOTER */}
                <div style={s.footer}>
                  <div style={s.dateBox}>
                    <Clock3 size={9} />
                    <span>{item.releaseDate}</span>
                  </div>

                  <div style={s.lockBox}>
                    <Lock size={8} />
                    <span>Verrouillé</span>
                  </div>
                </div>
              </div>

              {/* ACTION */}
              <div style={s.arrowBox}>
                <ChevronRight size={16} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default TrendingNews;

const s = {
  container: {
    padding: "14px 14px 80px",
  },

  topBar: {
    marginBottom: "14px",
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
    marginBottom: "8px",
  },

  title: {
    color: "#fff",
    fontSize: "17px",
    fontWeight: "900",
    margin: 0,
    lineHeight: 1.2,
  },

  titleAccent: {
    background: "linear-gradient(90deg,#00e0ff,#7a5cff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
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
    position: "relative",
    overflow: "hidden",
    cursor: "pointer",
    transition: "0.25s",
    backdropFilter: "blur(16px)",
  },

  imageWrapper: {
    width: "74px",
    minWidth: "74px",
    height: "98px",
    borderRadius: "14px",
    overflow: "hidden",
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "brightness(0.75)",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(5,7,13,0.7), transparent)",
  },

  comingBadge: {
    position: "absolute",
    top: "6px",
    left: "6px",
    display: "flex",
    alignItems: "center",
    gap: "3px",
    padding: "3px 6px",
    borderRadius: "999px",
    background: "rgba(0,0,0,0.55)",
    color: "#fff",
    fontSize: "7px",
    fontWeight: "800",
    letterSpacing: "0.5px",
  },

  content: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  },

  rowTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px",
    gap: "6px",
  },

  genre: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    color: "#94a3b8",
    fontSize: "8px",
    fontWeight: "800",
    textTransform: "uppercase",
  },

  status: {
    fontSize: "8px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  storyTitle: {
    color: "#fff",
    fontSize: "13px",
    fontWeight: "800",
    margin: "0 0 4px",
    lineHeight: 1.25,
  },

  desc: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "9px",
    lineHeight: 1.45,
    margin: 0,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "8px",
    gap: "6px",
  },

  dateBox: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    color: "#00e0ff",
    fontSize: "8px",
    fontWeight: "700",
  },

  lockBox: {
    display: "flex",
    alignItems: "center",
    gap: "3px",
    padding: "4px 7px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.05)",
    color: "#cbd5e1",
    fontSize: "7px",
    fontWeight: "700",
  },

  arrowBox: {
    width: "26px",
    minWidth: "26px",
    height: "26px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, rgba(0,224,255,0.12), rgba(122,92,255,0.12))",
    border: "1px solid rgba(255,255,255,0.05)",
    color: "#fff",
  },
};