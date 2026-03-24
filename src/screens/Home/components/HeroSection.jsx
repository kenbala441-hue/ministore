import React, { useMemo } from 'react';

const NEON_COLORS = ["#ff003c", "#00f7ff", "#ff00ff", "#8f00ff", "#39ff14", "#ffd300"];

export default function HeroSection({ story, setSelectedStory, setView }) {
  if (!story) return null;

  // Garder la même couleur pour cette session
  const neonColor = useMemo(
    () => NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
    []
  );

  const getCover = (story) => {
    return (
      story.coverImage ||
      story.cover ||
      (story.pages && story.pages[0]?.src) ||
      "https://via.placeholder.com/600x300/111111/00fff2?text=ComicCraft+Featured"
    );
  };

  return (
    <section
      onClick={() => { setSelectedStory(story); setView('reader'); }}
      style={{
        position: 'relative',
        height: '180px', // RÉDUIT pour plus de compacité
        borderRadius: '15px', // Coins plus doux
        overflow: 'hidden',
        marginBottom: '15px', // Espace réduit avec le composant suivant
        cursor: 'pointer',
        border: `1px solid ${neonColor}44`, // Fine bordure néon
        boxShadow: `0 4px 15px rgba(0,0,0,0.5)`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* L'image de fond */}
      <img
        src={getCover(story)}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover', 
          display: 'block',
          filter: 'brightness(0.8)' // Légèrement plus sombre pour lire le texte
        }}
        alt={story.title}
      />

      {/* Overlay de texte plus compact */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '12px 15px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 20%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}
      >
        <div
          style={{
            fontSize: '9px', // Très petit et élégant
            color: neonColor,
            fontWeight: '900',
            letterSpacing: '1px',
            marginBottom: '2px',
            textTransform: 'uppercase'
          }}
        >
          ✨ À LA UNE
        </div>
        
        <h2
          style={{
            fontSize: '18px', // Plus équilibré
            margin: '0',
            color: '#fff',
            fontWeight: 'bold',
            lineHeight: '1.2'
          }}
        >
          {story.title || "Titre inconnu"}
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <span style={{ 
                fontSize: '10px', 
                color: '#fff', 
                background: neonColor, 
                padding: '2px 6px', 
                borderRadius: '4px',
                fontWeight: 'bold'
            }}>
                {story.genres?.[0] || "Action"}
            </span>
            <span style={{ fontSize: '10px', color: '#ccc' }}>
                🔥 Popularité Élevée
            </span>
        </div>
      </div>

      {/* Petit effet de reflet néon au survol (CSS Inline) */}
      <style>
        {`
          section:active {
            transform: scale(0.97);
            filter: brightness(1.2);
          }
        `}
      </style>
    </section>
  );
}
