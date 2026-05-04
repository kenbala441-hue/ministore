import React, { useMemo } from "react";
import { PUBLIC_STORIES } from "../../../data/publicStories";
import { COMICCRAFTE_STORIES } from "../../../data/Action";

/**
 * COMPOSANT TRENDING GRID (VERSION PRO OPTIMISÉE)
 * - Sécurité anti-explosion de layout
 * - Support multi-source (Firebase / Local)
 * - Design système "Neon" dynamique
 */
export default function TrendingGrid({
  setView,
  setSelectedStory,
  stories = [],
  type = "public",
  neonColor = "#00f7ff"
}) {

  // ✅ FILTRAGE & SÉCURITÉ DES DONNÉES
  const data = useMemo(() => {
    // On priorise Firebase, sinon on utilise la data locale selon le type
    const source = (Array.isArray(stories) && stories.length > 0) 
      ? stories 
      : (type === "comicrafte" ? COMICCRAFTE_STORIES : PUBLIC_STORIES);
    
    // On s'assure que c'est un tableau et on limite à 12-15 pour la performance home
    return Array.isArray(source) ? source.slice(0, 15) : [];
  }, [stories, type]);

  // ✅ LOGIQUE DE NAVIGATION
  const handleOpen = (story) => {
    if (!story) return;
    setSelectedStory(story);
    setView("reader");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!data.length) return null; // Discret si vide

  const sectionTitle = type === "comicrafte" ? "📖 ORIGINALS" : "🔥 TRENDING";

  return (
    <div style={{ marginTop: "25px", width: "100%", padding: "0 5px" }}>
      
      {/* HEADER DE SECTION */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "15px",
      }}>
        <h3 style={{
          color: neonColor,
          fontSize: "16px",
          fontWeight: "900",
          letterSpacing: "0.5px",
          textTransform: "uppercase"
        }}>
          {sectionTitle}
        </h3>
        <span style={{ color: "#555", fontSize: "10px", fontWeight: "bold" }}>VOIR TOUT</span>
      </div>

      {/* GRILLE TECHNIQUE (3 COLONNES FIXES) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "12px",
        width: "100%"
      }}>
        {data.map((story, index) => (
          <div
            key={story?.id || index}
            onClick={() => handleOpen(story)}
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              minWidth: 0, // Empêche le texte de pousser la grille
              cursor: "pointer"
            }}
          >
            {/* BOX IMAGE - SÉCURISÉE */}
            <div style={{
              position: "relative",
              width: "100%",
              aspectRatio: "2 / 3",
              borderRadius: "10px",
              overflow: "hidden",
              backgroundColor: "#0d0d0d",
              border: "1px solid rgba(255,255,255,0.05)",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
            }}>
              <img
                src={story?.coverImage || story?.cover || "https://via.placeholder.com/300x450/111/222?text=..."}
                alt={story?.title}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.3s ease"
                }}
              />

              {/* BADGE CLASSEMENT (TOP 3) */}
              {index < 3 && (
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  background: `linear-gradient(135deg, ${neonColor}, #8f00ff)`,
                  color: "#000",
                  fontSize: "11px",
                  fontWeight: "900",
                  padding: "3px 8px",
                  borderBottomRightRadius: "8px",
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
                  background: "rgba(0,0,0,0.8)",
                  backdropFilter: "blur(4px)",
                  color: "#fff",
                  fontSize: "7px",
                  fontWeight: "800",
                  padding: "2px 5px",
                  borderRadius: "3px",
                  border: `0.5px solid ${neonColor}`
                }}>
                  CC ORIGINAL
                </div>
              )}
            </div>

            {/* INFOS TEXTE - ANTI-OVERFLOW */}
            <div style={{ marginTop: "8px", width: "100%" }}>
              <h4 style={{
                color: "#f0f0f0",
                fontSize: "11px",
                fontWeight: "700",
                margin: 0,
                lineHeight: "1.2",
                display: "-webkit-box",
                WebkitLineClamp: 2, // Coupe après 2 lignes
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                {story?.title || "Projet en cours..."}
              </h4>

              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "8px", 
                marginTop: "4px",
                fontSize: "9px",
                fontWeight: "800"
              }}>
                <span style={{ color: neonColor, display: "flex", alignItems: "center", gap: "2px" }}>
                  👁 {story?.viewsCount || story?.views || 0}
                </span>
                <span style={{ color: "#ff003c", display: "flex", alignItems: "center", gap: "2px" }}>
                  ❤️ {story?.likesCount || 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
