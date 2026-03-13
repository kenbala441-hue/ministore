import React, { useMemo } from 'react';

const NEON_COLORS = ["#ff003c", "#00f7ff", "#ff00ff", "#39ff14", "#ffd300", "#8f00ff"];

export default function NewsCard({ news, setView }) {
  // 🎨 Choix néon aléatoire
  const neonColor = useMemo(() => NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)], []);

  return (
    <div
      onClick={() => setView('reader')}
      style={{
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '15px',
        cursor: 'pointer',
        border: `1px solid ${neonColor}`,
        background: '#111',
        boxShadow: `0 0 10px ${neonColor}33, 0 0 20px ${neonColor}22`,
        transition: 'transform 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = `0 0 20px ${neonColor}, 0 0 40px ${neonColor}55`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = `0 0 10px ${neonColor}33, 0 0 20px ${neonColor}22`;
      }}
    >
      <img
        src={news.cover || '/placeholder-cover.jpg'}
        alt={news.title}
        style={{
          width: '100%',
          height: '120px',
          objectFit: 'cover',
          display: 'block',
        }}
      />
      <div style={{ padding: '10px' }}>
        <h4
          style={{
            margin: '0 0 5px 0',
            color: neonColor,
            fontSize: '14px',
            textShadow: `0 0 5px ${neonColor}, 0 0 10px ${neonColor}`,
          }}
        >
          {news.title}
        </h4>
        <p
          style={{
            margin: 0,
            color: '#aaa',
            fontSize: '11px',
            fontStyle: 'italic',
          }}
        >
          {news.genres?.join(', ') || 'Genre inconnu'}
        </p>
      </div>
    </div>
  );
}