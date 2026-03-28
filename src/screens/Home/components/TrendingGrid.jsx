import React from "react";
import { PUBLIC_STORIES } from "../../../data/publicStories";
import { COMICCRAFTE_STORIES } from "../../../data/COMICCRAFTE_DATA";

export default function TrendingGrid({
  setView,
  setSelectedStory,
  stories = [],       
  type = "public",    
  neonColor = "#00fff2"
}) {
  
  // 1. Sélection de la source de données
  const data = stories.length > 0 
    ? stories 
    : type === "comicrafte" 
      ? COMICCRAFTE_STORIES 
      : PUBLIC_STORIES;

  // 2. CORRECTION DU BUG DE NAVIGATION
  const handleOpen = (story) => {
    setSelectedStory(story);
    // On force 'reader' pour être sûr que l'histoire s'ouvre, 
    // peu importe si la propriété 'folder' existe ou non.
    setView("reader"); 
  };

  if (!data || data.length === 0) return null;

  const sectionTitle = type === "comicrafte" ? "📖 ComicCrafte Stories" : "🔥 Trending Stories";

  return (
    <div style={{ marginTop: "30px", paddingBottom: "20px" }}>
      <h3 style={{ 
        color: neonColor, 
        marginBottom: "15px", 
        fontSize: "18px",
        textTransform: "uppercase",
        letterSpacing: "1px",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        {sectionTitle}
      </h3>

      <div style={s.grid}>
        {data.map((story, index) => (
          <div
            key={story.id || index}
            className="trending-card" // On utilise une classe pour le CSS hover
            style={{
                ...s.card,
                border: `1px solid ${neonColor}33`,
            }}
            onClick={() => handleOpen(story)}
          >
            {/* IMAGE WRAPPER */}
            <div style={s.imageWrapper}>
              <img
                src={story.coverImage || "https://via.placeholder.com/300"}
                alt={story.title}
                style={s.image}
              />

              {/* BADGE DE CLASSEMENT (Visible pour le Top 3) */}
              {index < 3 && (
                <div style={{ 
                    ...s.badge, 
                    background: `linear-gradient(135deg, ${neonColor}, #8f00ff)` 
                }}>
                  #{index + 1}
                </div>
              )}

              {/* INDICATEUR "ORIGINAL" */}
              {story.isOriginal && (
                <div style={s.originalBadge}>CC ORIGINAL</div>
              )}
            </div>

            {/* INFO SECTION */}
            <div style={s.info}>
              <h4 style={s.title}>{story.title}</h4>
              <p style={s.author}>{story.author || "ComicCrafte Studio"}</p>
              
              <div style={s.footerCard}>
                <span style={{ color: neonColor }}>
                   👁 {story.viewsCount?.toLocaleString() || 0}
                </span>
                <span style={{ color: "#ff003c" }}>
                   ❤️ {story.likesCount || 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CSS INLINE POUR L'EFFET PRO AU CLICK ET SURVOL */}
      <style>
        {`
          .trending-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .trending-card:active {
            transform: scale(0.95);
          }
          @media (hover: hover) {
            .trending-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 5px 15px ${neonColor}44;
            }
          }
        `}
      </style>
    </div>
  );
}

/* =========================
   STYLES PRO (Objets JS)
========================= */
const s = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px",
  },

  card: {
    cursor: "pointer",
    borderRadius: "16px",
    overflow: "hidden",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    display: "flex",
    flexDirection: "column",
  },

  imageWrapper: {
    position: "relative",
    width: "100%",
    height: "180px", // Un peu plus grand pour l'esthétique
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
    padding: "4px 10px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "900",
    color: "#000",
    boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
  },

  originalBadge: {
    position: "absolute",
    bottom: "8px",
    right: "8px",
    background: "rgba(0,0,0,0.7)",
    color: "#fff",
    fontSize: "8px",
    padding: "2px 6px",
    borderRadius: "4px",
    border: "0.5px solid rgba(255,255,255,0.3)",
    letterSpacing: "1px"
  },

  info: {
    padding: "12px",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },

  title: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: "bold",
    margin: "0 0 4px 0",
    display: "-webkit-box",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  author: {
    fontSize: "11px",
    color: "#aaa",
    margin: "0 0 8px 0",
  },

  footerCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "10px",
    fontWeight: "bold",
  },
};
