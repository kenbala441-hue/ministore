import React from 'react';
import { comingSoonStories } from './newsData'; // Importe ta nouvelle liste

const TrendingNews = ({ onSelectStory }) => {
  return (
    <div style={s.container}>
      <h3 style={s.title}>PROCHAINEMENT <span style={s.neonText}>SUR COMICCRAFTE</span></h3>
      
      <div style={s.verticalList}>
        {comingSoonStories.map((item) => (
          <div key={item.id} style={s.newsItem} onClick={() => onSelectStory(item)}>
            <img src={item.img} style={s.thumb} alt={item.title} />
            <div style={s.details}>
              <div style={s.headerRow}>
                <span style={s.genreTag}>{item.genre}</span>
                <span style={{
                  ...s.statusBadge, 
                  color: item.status === 'RETARDÉ' ? '#ff4d4d' : '#a855f7'
                }}>
                  {item.status}
                </span>
              </div>
              <div style={s.storyTitle}>{item.title}</div>
              <div style={s.shortDesc}>{item.synopsis}</div>
              <div style={s.footerRow}>
                <span style={s.dateText}>📅 {item.releaseDate}</span>
                {/* On retire le badge Gratuit et on met un cadenas ou info */}
                <span style={s.lockBadge}>🔒 BIENTÔT</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const s = {
  container: { padding: '20px', marginTop: '10px' },
  title: { fontSize: '11px', letterSpacing: '2px', color: '#555', marginBottom: '15px' },
  neonText: { color: '#fff' },
  verticalList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  newsItem: { display: 'flex', gap: '12px', backgroundColor: '#0a0a0a', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1a1a1a' },
  thumb: { width: '90px', height: '120px', objectFit: 'cover', opacity: 0.7 }, // Un peu sombre car pas encore là
  details: { flex: 1, padding: '10px', display: 'flex', flexDirection: 'column' },
  headerRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '5px' },
  genreTag: { fontSize: '9px', color: '#666', fontWeight: 'bold' },
  statusBadge: { fontSize: '8px', fontWeight: 'bold' },
  storyTitle: { fontSize: '14px', fontWeight: 'bold', color: '#fff', marginBottom: '5px' },
  shortDesc: { fontSize: '10px', color: '#555', lineHeight: '1.3', marginBottom: '8px' },
  footerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' },
  dateText: { fontSize: '9px', color: '#a855f7', fontWeight: 'bold' },
  lockBadge: { fontSize: '8px', color: '#444', border: '1px solid #444', padding: '2px 5px', borderRadius: '4px' }
};

export default TrendingNews;
