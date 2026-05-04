import React, { useState, useMemo } from "react";
import { COMICCRAFTE_STORIES as storiesAction } from "../../../data/Action";

const ComicCrafteVertical = ({ setView, setSelectedStory, neonColor = "#00f7ff" }) => {

  const [visibleCount, setVisibleCount] = useState(10);

  const data = useMemo(() => {
    return Array.isArray(storiesAction) ? storiesAction : [];
  }, []);

  const visibleStories = data.slice(0, visibleCount);

  const handleOpen = (story) => {
    if (!story) return;

    const storyForReader = {
      ...story,
      source: "comicrafte",
      chapters: story.chapters 
        ? story.chapters 
        : (story.pages ? [{ title: "Chapitre 1", pages: story.pages }] : [])
    };

    setSelectedStory(storyForReader);
    setView("reader");
    window.scrollTo(0, 0);
  };

return (
  <div style={s.container}>

    <div style={s.list}>
      {visibleStories.map((item, index) => (
        <div
          key={item.id || index}
          style={s.card}
          onClick={() => handleOpen(item)}
        >

          {/* IMAGE */}
          <div style={s.imageWrapper}>
            <img
              src={item.coverImage}
              style={s.thumb}
              alt={item.title}
            />
            <div style={s.rank}>#{index + 1}</div>
          </div>

          {/* INFOS */}
          <div style={s.info}>

            {/* TOP */}
            <div style={s.top}>
              <span style={{ ...s.genre, color: neonColor }}>
                {item.genres?.[0] || "Story"}
              </span>

              {item.isOriginal && (
                <span style={s.badge}>ORIGINAL</span>
              )}
            </div>

            {/* TITLE */}
            <div style={s.title}>
              {item.title}
            </div>

            {/* BOTTOM */}
            <div style={s.bottom}>
              <div style={s.stats}>
                <span>👁 {item.viewsCount || 0}</span>
                <span>❤ {item.likesCount || 0}</span>
              </div>

              <div
                style={{
                  ...s.btn,
                  borderColor: neonColor
                }}
              >
                Lire
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>

    {/* VOIR PLUS / VOIR MOINS */}
    <div style={s.moreWrapper}>
      {visibleCount < data.length ? (
        <button
          onClick={() => setVisibleCount(prev => prev + 6)}
          style={{ ...s.moreBtn, borderColor: neonColor }}
        >
          Voir plus
        </button>
      ) : (
        <button
          onClick={() => setVisibleCount(10)}
          style={{ ...s.moreBtn, borderColor: "#555", opacity: 0.7 }}
        >
          Voir moins
        </button>
      )}
    </div>

  </div>
);
};
const s = {
  container: {
    marginTop: "10px",
    padding: "0 10px"
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  // 🔥 CARD PLUS FINE
  card: {
    display: "flex",
    height: "95px", // ↓ plus compact
    borderRadius: "12px",
    overflow: "hidden",
    background: "#0b0b0b",
    border: "1px solid #1a1a1a",
    cursor: "pointer",
    transition: "0.2s"
  },

  imageWrapper: {
  width: "85px",
  minWidth: "85px",
  height: "100%",
  position: "relative",
  backgroundColor: "#111"
},

  thumb: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },

  rank: {
    position: "absolute",
    top: "4px",
    left: "4px",
    fontSize: "9px",
    fontWeight: "900",
    background: "rgba(0,0,0,0.6)",
    padding: "2px 5px",
    borderRadius: "4px"
  },

  info: {
    flex: 1,
    padding: "8px 10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },

  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  genre: {
    fontSize: "8px",
    fontWeight: "900"
  },

  badge: {
    fontSize: "7px",
    padding: "2px 5px",
    borderRadius: "3px",
    background: "linear-gradient(45deg,#8b5cf6,#d946ef)"
  },

  title: {
  fontSize: "12px",
  fontWeight: "700",
  color: "#fff",
  lineHeight: "1.2",

  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",

  maxHeight: "30px"
},

  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  stats: {
    fontSize: "10px",
    color: "#777",
    display: "flex",
    gap: "8px"
  },

  btn: {
    fontSize: "9px",
    padding: "3px 10px",
    borderRadius: "20px",
    border: "1px solid",
    background: "#fff",
    color: "#000",
    fontWeight: "800"
  },

  moreWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: "15px"
  },

  moreBtn: {
    padding: "8px 20px",
    borderRadius: "20px",
    background: "transparent",
    border: "1px solid",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer"
  }
};

export default ComicCrafteVertical;