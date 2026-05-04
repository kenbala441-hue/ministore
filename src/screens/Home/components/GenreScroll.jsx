import React, { useState, useMemo } from 'react';
import { motion } from "framer-motion";
// Import de ta base de données unique
import { COMICCRAFTE_STORIES } from "../../../data/COMICCRAFTE_DATA";
import { PUBLIC_STORIES } from "../../../data/publicStories";

export default function GenreExplorer({ setView, setSelectedStory }) {
  // Liste des genres disponibles (basée sur tes images Webtoon)
  const genres = ["Tout", "Drama", "Fantastique", "Comédie", "Action", "Horreur", "Sci-Fi"];
  const [activeGenre, setActiveGenre] = useState("Tout");

  // Logique de filtrage automatique
  const displayData = useMemo(() => {
    if (activeGenre === "Tout") return COMICCRAFTE_STORIES;
    
    return COMICCRAFTE_STORIES.filter(story => 
      story.genres && story.genres.some(g => g.toLowerCase() === activeGenre.toLowerCase())
    );
  }, [activeGenre]);

  return (
    <div style={styles.mainContainer}>
      
      {/* 1. MENU DE FILTRAGE (Horizontal) */}
      <div style={styles.filterBar}>
        {genres.map(g => (
          <button
            key={g}
            onClick={() => setActiveGenre(g)}
            style={{
              ...styles.genreButton,
              backgroundColor: activeGenre === g ? "#FFFFFF" : "#222",
              color: activeGenre === g ? "#000" : "#999",
            }}
          >
            {g}
          </button>
        ))}
      </div>

      {/* 2. AFFICHAGE DES RÉSULTATS (Scroll Horizontal) */}
      <div style={styles.resultsScroll}>
        {displayData.length > 0 ? (
          displayData.map((story) => (
            <motion.div
              key={story.id}
              whileTap={{ scale: 0.95 }}
              style={styles.card}
              onClick={() => {
                setSelectedStory?.(story);
                setView?.("reader");
              }}
            >
              <div style={styles.imageContainer}>
                <img 
                  src={story.coverImage} 
                  alt={story.title} 
                  style={styles.image} 
                />
              </div>
              <div style={styles.storyTitle}>{story.title}</div>
            </motion.div>
          ))
        ) : (
          <div style={styles.empty}>Bientôt disponible...</div>
        )}
      </div>
    </div>
  );
}

/* STYLES WEBTOON DARK MODE */
const styles = {
  mainContainer: {
    backgroundColor: '#000',
    padding: '10px 0',
    margin: '10px 0'
  },
  filterBar: {
    display: 'flex',
    overflowX: 'auto',
    gap: '8px',
    padding: '0 15px 15px 15px',
    scrollbarWidth: 'none',
  },
  genreButton: {
    padding: '6px 16px',
    borderRadius: '20px',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: '0.2s'
  },
  resultsScroll: {
    display: 'flex',
    overflowX: 'auto',
    gap: '10px',
    padding: '0 15px',
    scrollbarWidth: 'none',
  },
  card: {
    width: '110px',
    flexShrink: 0,
    cursor: 'pointer'
  },
  imageContainer: {
    width: '110px',
    aspectRatio: '1 / 1', // Format carré comme dans "Séries à binger"
    borderRadius: '4px',
    overflow: 'hidden',
    backgroundColor: '#1a1a1a'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  storyTitle: {
    color: '#fff',
    fontSize: '11px',
    marginTop: '6px',
    fontWeight: '500',
    textAlign: 'center',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    lineHeight: '1.2'
  },
  empty: {
    color: '#555',
    padding: '20px',
    fontSize: '12px'
  }
};
