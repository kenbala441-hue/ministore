import React, { useMemo } from "react";

/**
 * STORYCARD VERSION PRO (GRID COMPATIBLE)
 * Adaptée pour TrendingGrid (3 colonnes)
 */
export default function StoryCard({ story, setSelectedStory, setView, index, type }) {
  const PLACEHOLDER = "https://res.cloudinary.com/dn9c4ctav/image/upload/v1772147595/1751816044094_fvqghc.png";
  const neonColor = "#00f7ff";

  const { title = "Projet...", viewsCount = 0, likesCount = 0 } = story || {};

  const coverSrc = useMemo(() => {
    if (!story) return PLACEHOLDER;
    return story.coverImage || story.cover || story.pages?.[0]?.src || PLACEHOLDER;
  }, [story]);

  return (
    <div
      onClick={() => { 
        setSelectedStory(story); 
        setView("reader");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        minWidth: 0, // CRUCIAL: Empêche le texte de casser la grille
        cursor: "pointer",
        transition: "transform 0.2s ease"
      }}
      className="story-card-item"
    >
      {/* BOX IMAGE - RATIO 2/3 FIXE */}
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "2 / 3",
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#0d0d0d",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.4)"
      }}>
        <img
          src={coverSrc}
          alt={title}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block"
          }}
          onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
        />

        {/* BADGE CLASSEMENT (Si passé en props) */}
        {index < 3 && (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            background: `linear-gradient(135deg, ${neonColor}, #8f00ff)`,
            color: "#000",
            fontSize: "10px",
            fontWeight: "900",
            padding: "3px 8px",
            borderBottomRightRadius: "10px",
            zIndex: 2,
            fontStyle: "italic"
          }}>
            #{index + 1}
          </div>
        )}

        {/* BADGE ORIGINAL */}
        {(story?.isOriginal || type === "comicrafte") && (
          <div style={{
            position: "absolute",
            bottom: "6px",
            right: "6px",
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(4px)",
            color: "#fff",
            fontSize: "7px",
            fontWeight: "800",
            padding: "2px 5px",
            borderRadius: "4px",
            border: `0.5px solid ${neonColor}`
          }}>
            CC ORIGINAL
          </div>
        )}
      </div>

      {/* INFOS TEXTE */}
      <div style={{ marginTop: "8px", width: "100%", padding: "0 2px" }}>
        <h4 style={{
          color: "#fff",
          fontSize: "11px",
          fontWeight: "700",
          margin: 0,
          lineHeight: "1.2",
          display: "-webkit-box",
          WebkitLineClamp: 2, // Coupe proprement à 2 lignes
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}>
          {title}
        </h4>

        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "8px", 
          marginTop: "4px",
          fontSize: "9px",
          fontWeight: "800",
          opacity: 0.8
        }}>
          <span style={{ color: neonColor, display: "flex", alignItems: "center", gap: "2px" }}>
            👁 {viewsCount}
          </span>
          <span style={{ color: "#ff0055", display: "flex", alignItems: "center", gap: "2px" }}>
            ❤️ {likesCount}
          </span>
        </div>
      </div>
    </div>
  );
}
