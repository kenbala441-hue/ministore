import React from "react";
import { PUBLIC_STORIES } from "../../../data/publicStories";
import { COMICCRAFTE_STORIES } from "../../../data/COMICCRAFTE_DATA";


export default function TrendingGrid({
  setView,
  setSelectedStory,
  stories = [],       // Possibilité de paser une DB personnalisée
  type = "public",    // "public" ou "comicrafte"
  neonColor = "#00fff2"
}) {
  // Choisir la source selon props ou type
  const data =
    stories.length > 0
      ? stories
      : type === "comicrafte"
      ? COMICCRAFTE_STORIES
      : PUBLIC_STORIES;

  const handleOpen = (story) => {
    setSelectedStory(story);
    setView(story.folder ? "reader" : "story");
  };

  if (!data || data.length === 0) return null;

  // Titre dynamique selon source
  const sectionTitle =
    type === "comicrafte" ? "📖 ComicCrafte Stories" : "🔥 Trending Stories";

  return (
    <div style={{ marginTop: "30px" }}>
      <h3 style={{ color: neonColor, marginBottom: "15px" }}>
        {sectionTitle}
      </h3>

      <div style={s.grid}>
        {data.map((story, index) => (
          <div
            key={story.id || index}
            style={s.card}
            onClick={() => handleOpen(story)}
          >
            {/* IMAGE */}
            <div style={s.imageWrapper}>
              <img
                src={story.coverImage || "https://via.placeholder.com/300"}
                alt={story.title}
                style={s.image}
              />

              {/* BADGE TOP */}
              {index < 3 && (
                <div style={{ ...s.badge, background: `linear-gradient(90deg, ${neonColor}, #00bbf9)` }}>
                  #{index + 1}
                </div>
              )}
            </div>

            {/* INFO */}
            <div style={s.info}>
              <h4 style={s.title}>{story.title}</h4>
              <p style={s.author}>{story.author || "Unknown"}</p>
              <div style={s.stats}>
                👁 {story.viewsCount || 0} · ❤️ {story.likesCount || 0}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */
const s = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px",
  },

  card: {
    cursor: "pointer",
    borderRadius: "14px",
    overflow: "hidden",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid #00fff233",
    boxShadow: "0 0 10px rgba(0,255,242,0.15)",
    transition: "0.3s",
  },

  imageWrapper: {
    position: "relative",
    width: "100%",
    height: "160px",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  badge: {
    position: "absolute",
    top: "8px",
    left: "8px",
    padding: "3px 8px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "bold",
    color: "#000",
  },

  info: {
    padding: "10px",
  },

  title: {
    color: "#fff",
    fontSize: "14px",
    marginBottom: "4px",
  },

  author: {
    fontSize: "11px",
    color: "#aaa",
    marginBottom: "6px",
  },

  stats: {
    fontSize: "11px",
    color: "#00fff2",
  },
};