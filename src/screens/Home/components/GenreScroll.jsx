import React from 'react';

export default function GenreScroll({ genres, activeGenre, setActiveGenre, neonColor }) {
  return (
    <div style={{ display: 'flex', overflowX: 'auto', gap: 10, paddingBottom: 20 }}>
      {genres.map(g => (
        <button
          key={g}
          onClick={() => setActiveGenre(g)}
          style={{
            padding: '8px 16px',
            borderRadius: 20,
            border: activeGenre === g ? 'none' : '1px solid #222',
            backgroundColor: activeGenre === g ? neonColor : '#111',
            color: activeGenre === g ? 'black' : '#888',
            whiteSpace: 'nowrap',
            fontSize: 11,
            cursor: 'pointer',
            boxShadow: activeGenre === g ? `0 0 15px ${neonColor}44` : 'none'
          }}
        >
          {g}
        </button>
      ))}
    </div>
  );
}