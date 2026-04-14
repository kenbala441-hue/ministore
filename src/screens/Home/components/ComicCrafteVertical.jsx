import React from "react";
import { COMICCRAFTE_STORIES as storiesAction } from "../../../data/Action";

const ComicCrafteVertical = ({ setView, setSelectedStory, neonColor }) => {

  const handleOpen = (story) => {
    const normalizedStory = {
      ...story,

      // 🔥 IMPORTANT : Reader attend ça
      chapters: story.chapters
        ? story.chapters
        : story.content
        ? story.content
        : story.pages
        ? [
            {
              title: "Chapitre 1",
              pages: story.pages,
            },
          ]
        : [
            {
              title: "Chapitre 1",
              pages: [],
            },
          ],
    };

    setSelectedStory(normalizedStory);
    setView("reader");
  };

  return (
    <div style={s.container}>
      <div style={s.verticalList}>
        {storiesAction.map((item) => (
          <div
            key={item.id}
            style={s.newsItem}
            onClick={() => handleOpen(item)}
          >
            <div style={s.imageWrapper}>
              <img src={item.coverImage} style={s.thumb} alt={item.title} />
              <div style={s.imageOverlay}></div>
            </div>

            <div style={s.details}>
              <div style={s.headerRow}>
                <span style={{ ...s.genreTag, color: neonColor || "#00f7ff" }}>
                  {item.genres?.[0] || "Action"}
                </span>
                {item.isOriginal && (
                  <span style={s.statusBadge}>ORIGINAL</span>
                )}
              </div>

              <div style={s.storyTitle}>{item.title}</div>
              <div style={s.authorText}>par {item.author}</div>

              <div style={s.footerRow}>
                <div style={s.stats}>
                  <span style={s.statItem}>👁️ {item.viewsCount}</span>
                  <span style={s.statItem}>❤️ {item.likesCount}</span>
                </div>

                <button
                  style={{
                    ...s.readBtn,
                    borderColor: neonColor || "#00f7ff",
                  }}
                >
                  LIRE
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const s = {
  container: { marginTop: "10px" },
  verticalList: { display: "flex", flexDirection: "column", gap: "14px" },
  newsItem: {
    display: "flex",
    gap: "12px",
    backgroundColor: "#111",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #222",
    height: "120px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    cursor: "pointer",
  },
  imageWrapper: { position: "relative", width: "90px", height: "100%" },
  thumb: { width: "100%", height: "100%", objectFit: "cover" },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(to right, transparent, rgba(17,17,17,0.2))",
  },
  details: {
    flex: 1,
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  genreTag: {
    fontSize: "10px",
    fontWeight: "800",
    textTransform: "uppercase",
  },
  statusBadge: {
    fontSize: "8px",
    fontWeight: "bold",
    color: "#fff",
    background: "#a855f7",
    padding: "2px 7px",
    borderRadius: "4px",
  },
  storyTitle: { fontSize: "16px", fontWeight: "bold", color: "#fff" },
  authorText: { fontSize: "11px", color: "#555" },
  footerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stats: { display: "flex", gap: "10px" },
  statItem: { fontSize: "10px", color: "#777" },
  readBtn: {
    background: "transparent",
    color: "#fff",
    border: "1px solid",
    padding: "4px 12px",
    borderRadius: "8px",
    fontSize: "10px",
    fontWeight: "bold",
  },
};

export default ComicCrafteVertical;