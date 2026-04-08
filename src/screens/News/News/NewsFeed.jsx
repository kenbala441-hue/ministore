import React from 'react';

const NewsFeed = ({ setView }) => {
  return (
    <div style={s.container}>
      {/* BANNIÈRE ÉVÉNEMENT */}
      <div style={s.eventBanner}>
        <span style={s.eventTag}>ÉVÉNEMENT</span>
        <h4 style={{margin: '5px 0 0 0'}}>Concours ComicCrafte 🏆</h4>
        <p style={{fontSize: '10px', opacity: 0.8}}>Gagnez des Ink en participant !</p>
      </div>

      <h3 style={s.sectionTitle}>Dernières Sorties</h3>
      {[1, 2, 3].map(i => (
        <div key={i} style={s.newsCard} onClick={() => setView('reader')}>
          <img src={`https://picsum.photos/100/100?sig=${i}`} style={s.img} />
          <div style={{flex: 1}}>
            <div style={s.storyTitle}>The Last God</div>
            <div style={s.storyMeta}>Chapitre {80 + i} • Action</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const s = {
  container: { padding: '15px' },
  eventBanner: { background: 'linear-gradient(90deg, #6366f1, #a855f7)', padding: '15px', borderRadius: '15px', marginBottom: '20px' },
  eventTag: { fontSize: '8px', background: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' },
  sectionTitle: { fontSize: '14px', color: '#a855f7', marginBottom: '15px' },
  newsCard: { display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: '#111', padding: '10px', borderRadius: '12px', marginBottom: '10px' },
  img: { width: '50px', height: '50px', borderRadius: '8px' },
  storyTitle: { fontSize: '13px', fontWeight: 'bold' },
  storyMeta: { fontSize: '10px', color: '#666' }
};

export default NewsFeed;
