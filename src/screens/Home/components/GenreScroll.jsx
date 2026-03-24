import React from 'react';

// L'export default est crucial ici
export default function GenreScroll({ genres, activeGenre, setActiveGenre, neonColor }) {
  return (
    <div style={{ 
      display: 'flex', 
      overflowX: 'auto', 
      gap: 10, 
      paddingBottom: '15px', // Espace pour le scrollbar
      scrollbarWidth: 'none', // Cache le scrollbar sur Firefox
      msOverflowStyle: 'none', // Cache le scrollbar sur IE/Edge
      paddingLeft: '5px'
    }}>
      {genres.map(g => (
        <button
          key={g}
          onClick={() => setActiveGenre(g)}
          style={{
            padding: '8px 18px',
            borderRadius: 25,
            border: activeGenre === g ? 'none' : '1px solid #222',
            backgroundColor: activeGenre === g ? neonColor : '#111',
            color: activeGenre === g ? '#000' : '#888',
            whiteSpace: 'nowrap',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: activeGenre === g ? `0 0 15px ${neonColor}66` : 'none',
            flexShrink: 0 // Empêche le bouton de s'écraser
          }}
        >
          {g}
        </button>
      ))}
      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}
