import React from "react";
import { Play, Eye } from "lucide-react";

export default function VerticalSection({ 
  title = "TITRE SECTION", 
  data = [], 
  setView, 
  setSelectedStory,
  neonColor = "#FFD700" // Jaune comme sur ton image
}) {

  const handleOpen = (story) => {
    if (!story) return;
    setSelectedStory(story);
    setView("reader");
    window.scrollTo(0, 0);
  };

  if (!data.length) return null;

  return (
    <div style={{ margin: "25px 0", width: "100%" }}>
      
      {/* HEADER AVEC LA BARRE JAUNE */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "10px", 
        padding: "0 15px", 
        marginBottom: "15px" 
      }}>
        <div style={{ width: "4px", height: "20px", background: neonColor, borderRadius: "2px" }} />
        <h3 style={{ 
          color: "#fff", 
          fontSize: "16px", 
          fontWeight: "900", 
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          margin: 0
        }}>
          {title}
        </h3>
      </div>

      {/* SCROLL HORIZONTAL DES CARTES VERTICALES */}
      <div className="no-scrollbar" style={{ 
        display: "flex", 
        gap: "12px", 
        overflowX: "auto", 
        padding: "0 15px",
        paddingBottom: "10px" 
      }}>
        {data.map((story, i) => (
          <div 
            key={story.id || i}
            onClick={() => handleOpen(story)}
            style={{ 
              minWidth: "150px", // Largeur fixe pour l'aspect vertical
              flexShrink: 0,
              cursor: "pointer"
            }}
          >
            {/* IMAGE AVEC LE PETIT BADGE EN HAUT */}
            <div style={{ 
              position: "relative", 
              width: "100%", 
              height: "210px", 
              borderRadius: "12px", 
              overflow: "hidden",
              border: "1px solid #1a1a1a"
            }}>
              <img 
                src={story.coverImage || story.cover} 
                alt={story.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              
              {/* BADGE CATEGORIE (Ex: FABLE sur ton image) */}
              <div style={{ 
                position: "absolute", 
                top: "8px", 
                left: "8px", 
                background: neonColor, 
                color: "#000", 
                fontSize: "9px", 
                fontWeight: "900", 
                padding: "2px 6px", 
                borderRadius: "4px",
                textTransform: "uppercase"
              }}>
                {story.genres?.[0] || "STORY"}
              </div>
            </div>

            {/* INFOS SOUS L'IMAGE */}
            <div style={{ marginTop: "10px" }}>
              <h4 style={{ 
                color: "#fff", 
                fontSize: "13px", 
                fontWeight: "700", 
                margin: "0 0 2px 0",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                {story.title}
              </h4>
              <p style={{ 
                color: "#666", 
                fontSize: "11px", 
                margin: "0 0 6px 0" 
              }}>
                {story.author || "Classique"}
              </p>

              {/* STATS & BOUTON LIRE (Style Image 1) */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#999", fontSize: "10px" }}>
                  <Eye size={12} />
                  <span>{story.viewsCount || 0}</span>
                </div>
                
                <button style={{ 
                  background: "#fff", 
                  border: "none", 
                  borderRadius: "5px", 
                  padding: "4px 8px", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "4px",
                  fontSize: "10px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}>
                  <Play size={10} fill="black" /> Lire
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
