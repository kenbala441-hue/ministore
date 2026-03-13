import React, { useMemo } from 'react';

const NEON_COLORS = ["#ff003c", "#00f7ff", "#ff00ff", "#8f00ff", "#39ff14", "#ffd300"];

export default function HeroSection({ story, setSelectedStory, setView }) {
  if (!story) return null;

  const neonColor = useMemo(
    () => NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
    []
  );

  // Fonction pour récupérer une image valide
  const getCover = (story) => {
    return (
      story.coverImage ||
      story.cover ||
      story.pages?.find(p => p.type === 'image')?.src ||
      "https://via.placeholder.com/300x400/111111/00fff2?text=No+Cover"
    );
  };

  return (
    <section
      onClick={() => { setSelectedStory(story); setView('reader'); }}
      style={{
        position: 'relative',
        height: '220px',
        borderRadius: '20px',
        overflow: 'hidden',
        marginBottom: '30px',
        cursor: 'pointer',
        boxShadow: `0 0 15px ${neonColor}33, 0 0 30px ${neonColor}22`,
        transition: 'transform 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.03)';
        e.currentTarget.style.boxShadow = `0 0 25px ${neonColor}, 0 0 50px ${neonColor}55`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = `0 0 15px ${neonColor}33, 0 0 30px ${neonColor}22`;
      }}
    >
      <img
        src={getCover(story)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        alt="banner"
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.95))',
        }}
      >
        <div
          style={{
            fontSize: '10px',
            color: neonColor,
            fontWeight: 'bold',
            marginBottom: '5px',
            textShadow: `0 0 5px ${neonColor}, 0 0 10px ${neonColor}`,
          }}
        >
          ⭐ RECOMMANDÉ POUR VOUS
        </div>
        <h2
          style={{
            fontSize: '22px',
            margin: '0 0 5px 0',
            color: neonColor,
            textShadow: `0 0 5px ${neonColor}, 0 0 10px ${neonColor}`,
          }}
        >
          {story.title || "Titre inconnu"}
        </h2>
        <p style={{ fontSize: '12px', color: '#aaa', fontStyle: 'italic' }}>
          {story.genres?.join(", ") || "Genre inconnu"} • 🔥 Popularité Élevée
        </p>
      </div>
    </section>
  );
}