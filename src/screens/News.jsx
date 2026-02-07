import React, { useState } from 'react';

export default function News({ setView }) {
  const [rankingPeriod, setRankingPeriod] = useState('Jour');

  const authors = [
    { name: "Z-Art", rank: 1, avatar: "🔥", points: "25k" },
    { name: "SoloLevel", rank: 2, avatar: "⚡", points: "18k" },
    { name: "MangaKa", rank: 3, avatar: "🎨", points: "12k" },
  ];

  return (
    <div style={s.container}>
      {/* --- BANNIÈRE ÉVÉNEMENT --- */}
      <div style={s.eventBanner}>
        <span style={s.eventTag}>ÉVÉNEMENT</span>
        <h4 style={{margin: '5px 0 0 0'}}>Concours de Dessin : Saison 2 🏆</h4>
        <p style={{fontSize: '10px', opacity: 0.8}}>1000 Coins à gagner pour le meilleur auteur !</p>
      </div>

      {/* --- MEILLEURS CONTRIBUTEURS --- */}
      <h3 style={s.sectionTitle}>Meilleurs Contributeurs</h3>
      <div style={s.authorsRow}>
        {authors.map(auth => (
          <div key={auth.rank} style={s.authorCard}>
            <div style={s.avatarCircle}>{auth.avatar}</div>
            <div style={s.authName}>{auth.name}</div>
            <div style={s.authPoints}>{auth.points} pts</div>
          </div>
        ))}
      </div>

      {/* --- CLASSEMENT TOP HISTOIRES --- */}
      <div style={s.rankHeader}>
        <h3 style={s.sectionTitle}>Classement</h3>
        <div style={s.periodTabs}>
          {['Jour', 'Semaine', 'Mois'].map(p => (
            <span 
              key={p} 
              onClick={() => setRankingPeriod(p)}
              style={rankingPeriod === p ? s.pActive : s.pInactive}
            >{p}</span>
          ))}
        </div>
      </div>

      {/* --- LISTE DES SORTIES --- */}
      <div style={s.updateList}>
        {[1, 2, 3].map(i => (
          <div key={i} style={s.newsCard} onClick={() => setView('reader')}>
            <div style={s.rankNum}>#{i}</div>
            <img src={`https://picsum.photos/100/100?sig=${i+10}`} style={s.img} />
            <div style={{flex: 1}}>
              <div style={s.storyTitle}>The Last God</div>
              <div style={s.storyMeta}>Chapitre 88 • Action</div>
              <div style={s.likes}>❤️ 12.5k likes ce {rankingPeriod.toLowerCase()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  container: { padding: '15px', backgroundColor: '#050505', minHeight: '100vh', paddingBottom: '100px' },
  eventBanner: { background: 'linear-gradient(90deg, #6366f1, #a855f7)', padding: '15px', borderRadius: '15px', marginBottom: '25px' },
  eventTag: { fontSize: '8px', background: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' },
  sectionTitle: { fontSize: '14px', color: '#a855f7', fontWeight: 'bold', marginBottom: '15px' },
  authorsRow: { display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '25px', paddingBottom: '10px' },
  authorCard: { minWidth: '85px', backgroundColor: '#111', padding: '10px', borderRadius: '12px', textAlign: 'center', border: '1px solid #222' },
  avatarCircle: { width: '40px', height: '40px', backgroundColor: '#1a1a1a', borderRadius: '50%', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
  authName: { fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden' },
  authPoints: { fontSize: '9px', color: '#a855f7' },
  rankHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  periodTabs: { display: 'flex', gap: '10px', backgroundColor: '#111', padding: '4px', borderRadius: '20px' },
  pActive: { fontSize: '10px', backgroundColor: '#a855f7', padding: '3px 10px', borderRadius: '15px', color: 'white' },
  pInactive: { fontSize: '10px', color: '#555', padding: '3px 10px' },
  newsCard: { display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: '#0a0a0a', padding: '10px', borderRadius: '12px', marginBottom: '10px', borderBottom: '1px solid #111' },
  rankNum: { fontSize: '18px', fontWeight: 'black', color: '#333', fontStyle: 'italic', width: '25px' },
  img: { width: '55px', height: '55px', borderRadius: '8px', objectFit: 'cover' },
  storyTitle: { fontSize: '13px', fontWeight: 'bold' },
  storyMeta: { fontSize: '10px', color: '#a855f7', marginTop: '2px' },
  likes: { fontSize: '9px', color: '#444', marginTop: '4px' }
};
