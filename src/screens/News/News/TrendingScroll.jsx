import React from "react";
import { PUBLIC_STORIES } from "../../../data/publicStories";

export default function TrendingScroll({ setView, setSelectedStory }) {
  
  // Sécurité filtre
  const trendingData = PUBLIC_STORIES.filter(s => s.isTrending).length > 0 
    ? PUBLIC_STORIES.filter(s => s.isTrending).slice(0, 10)
    : PUBLIC_STORIES.slice(0, 10);

  const handleOpen = (story) => {
    setSelectedStory(story);
    setView("reader"); 
  };

  // Fonction pour gérer les couleurs selon le rang
  const getRankStyle = (index) => {
    if (index === 0) return { color: "#FFD700", scale: "1" }; // OR (Le plus grand)
    if (index === 1) return { color: "#C0C0C0", scale: "0.9" }; // ARGENT
    if (index === 2) return { color: "#CD7F32", scale: "0.9" }; // BRONZE
    if (index < 6) return { color: "#a855f7", scale: "0.85" }; // VIOLET TOP 6
    return { color: "#555", scale: "0.85" }; // RESTE
  };

  return (
    <div style={st.container}>
      <div style={st.header}>
        <h3 style={st.sectionTitle}>🔥 TOP <span style={{color: "#FFD700"}}>LECTURES</span></h3>
        <span style={st.seeMore} onClick={() => setView('multiverse')}>Tout voir</span>
      </div>

      <div style={st.scrollContainer}>
        {trendingData.map((story, index) => {
          const rank = getRankStyle(index);
          return (
            <div 
              key={story.id || index} 
              style={{...st.miniCard, transform: `scale(${rank.scale})` }} 
              onClick={() => handleOpen(story)}
            >
              <div style={st.imgWrapper}>
                <img src={story.coverImage || story.image} style={st.image} alt={story.title} />
                
                {/* Badge Dynamique : Dégradé basé sur le rang */}
                <div style={{
                  ...st.rankBadge, 
                  background: `linear-gradient(to top, ${rank.color}, transparent)`,
                  fontSize: index === 0 ? "32px" : "24px" // Numéro plus gros pour le #1
                }}>
                  {index + 1}
                </div>
              </div>
              <div style={st.infoBox}>
                 <div style={{...st.title, color: index === 0 ? "#FFD700" : "#eee"}}>{story.title}</div>
                 <div style={st.genre}>{story.genre || "Manga"}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const st = {
  container: { margin: "15px 0" }, // Réduit l'espace vertical
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px", marginBottom: "8px" },
  sectionTitle: { fontSize: "14px", fontWeight: "900", color: "#fff" },
  seeMore: { color: "#444", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase" },
  scrollContainer: {
    display: "flex",
    overflowX: "auto",
    paddingLeft: "15px",
    gap: "5px", // Gap très réduit pour coller les éléments
    scrollbarWidth: "none",
    alignItems: "flex-end" // Aligne le podium par le bas
  },
  miniCard: { 
    minWidth: "95px", // Plus étroit pour en voir plus à l'écran
    width: "95px", 
    cursor: "pointer",
    transition: "transform 0.2s"
  },
  imgWrapper: { 
    position: "relative", 
    width: "95px", 
    height: "135px", // Taille réduite pour économiser l'espace
    borderRadius: "10px", 
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
    backgroundColor: '#0a0a0a'
  },
  image: { width: "100%", height: "100%", objectFit: "cover" },
  rankBadge: { 
    position: "absolute", bottom: 0, left: 0, right: 0,
    height: "60%", display: "flex", alignItems: "flex-end",
    padding: "2px 8px", color: "#fff", fontWeight: "900",
    fontStyle: "italic", pointerEvents: 'none',
    WebkitTextStroke: "1px rgba(0,0,0,0.5)" // Ombre sur le chiffre
  },
  infoBox: { marginTop: "5px", padding: "0 4px" },
  title: { fontSize: "10px", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  genre: { fontSize: "8px", color: "#555", marginTop: "1px" }
};
