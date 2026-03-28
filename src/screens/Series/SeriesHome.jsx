import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Bookmark, Star } from "lucide-react";
import { COMICCRAFTE_STORIES } from "../../data/COMICCRAFTE_DATA";

export default function SeriesHome({ setView, setSelectedStory }) {
  const [filter, setFilter] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["Tous", "Manga", "Light Novel", "Webtoon"];

  const filteredStories = COMICCRAFTE_STORIES.filter(story => {
    const matchesFilter = filter === "Tous" || story.type === filter;
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={s.container}>
      {/* Barre de recherche Style Glassmorphism */}
      <div style={s.searchSection}>
        <div style={s.searchBar}>
          <Search size={18} style={{ opacity: 0.5 }} />
          <input 
            placeholder="Rechercher une série..." 
            style={s.input}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filtres Catégories */}
      <div style={s.filterRow}>
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setFilter(cat)}
            style={filter === cat ? s.activeFilter : s.filterBtn}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grille des Séries */}
      <div style={s.grid}>
        {filteredStories.map((story) => (
          <motion.div 
            key={story.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedStory(story);
              setView("details");
            }}
            style={s.card}
          >
            <div style={s.imageContainer}>
              <img src={story.cover} alt={story.title} style={s.cover} />
              <div style={s.badge}>{story.type}</div>
            </div>
            <div style={s.info}>
              <h3 style={s.title}>{story.title}</h3>
              <div style={s.meta}>
                <span style={s.rating}><Star size={12} fill="#ff00ff" /> 4.8</span>
                <span style={s.chaptersCount}>{story.chapters?.length} Ch.</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const s = {
  container: { padding: "20px", paddingBottom: "100px" },
  searchSection: { marginBottom: "20px" },
  searchBar: { 
    display: "flex", alignItems: "center", gap: "10px", 
    background: "rgba(255,255,255,0.05)", padding: "12px 15px", 
    borderRadius: "15px", border: "1px solid rgba(255,255,255,0.1)" 
  },
  input: { background: "none", border: "none", color: "white", outline: "none", width: "100%" },
  filterRow: { display: "flex", gap: "10px", overflowX: "auto", marginBottom: "25px", paddingBottom: "5px" },
  filterBtn: { 
    background: "#1a1a1c", color: "#888", border: "none", 
    padding: "8px 18px", borderRadius: "20px", whiteSpace: "nowrap" 
  },
  activeFilter: { 
    background: "#00f7ff", color: "#000", border: "none", 
    padding: "8px 18px", borderRadius: "20px", fontWeight: "bold",
    boxShadow: "0 0 10px #00f7ff"
  },
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", 
    gap: "15px" 
  },
  card: { background: "#121214", borderRadius: "15px", overflow: "hidden", border: "1px solid #222" },
  imageContainer: { position: "relative", height: "200px" },
  cover: { width: "100%", height: "100%", objectFit: "cover" },
  badge: { 
    position: "absolute", bottom: "10px", left: "10px", 
    background: "rgba(0,0,0,0.7)", padding: "4px 8px", 
    borderRadius: "6px", fontSize: "10px", color: "#00f7ff" 
  },
  info: { padding: "10px" },
  title: { fontSize: "14px", fontWeight: "bold", marginBottom: "5px", color: "#fff" },
  meta: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  rating: { fontSize: "11px", color: "#ff00ff", display: "flex", alignItems: "center", gap: "4px" },
  chaptersCount: { fontSize: "10px", opacity: 0.5 }
};
