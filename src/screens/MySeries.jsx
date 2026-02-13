import React, { useState, useEffect } from 'react';

export default function MySeries({ setView, setSelectedStory }) {
  const [activeTab, setActiveTab] = useState('RÉCENT');
  const [bgColor, setBgColor] = useState('#000');

  useEffect(() => {
    const colors = ['#1a001a', '#220022', '#330033', '#440044', '#000022', '#220011'];
    setBgColor(colors[Math.floor(Math.random() * colors.length)]);
  }, []);

  const myData = [
    { id: 1, title: "Villain To Kill", ep: "Ep.187", date: "Lu il y a 53 jours", img: "https://picsum.photos/200/300?sig=1" },
    { id: 2, title: "Nano Machine", ep: "Ep.152", date: "Lu il y a 10 jours", img: "https://picsum.photos/200/300?sig=2" }
  ];

  const handleContinue = (story) => {
    if (setSelectedStory) setSelectedStory(story);
    setView('reader');
  };

  return (
    <div style={{ ...s.container, background: `radial-gradient(circle at top, ${bgColor}, #000)` }}>
      {/* HEADER */}
      <div style={s.header}>
        <h2 style={{ fontSize: '22px', color: '#e0b3ff', textShadow: '0 0 8px #a855f7' }}>Mes Séries</h2>
        <div style={s.headerIcons}>
          <span onClick={() => alert('Mode suppression actif')} style={s.topIcon}>🗑️</span>
          <span onClick={() => setView('store')} style={s.topIcon}>🪙</span>
          <span onClick={() => setView('home')} style={s.topIcon}>🏠</span>
        </div>
      </div>

      {/* ONGLETS */}
      <div style={s.tabs}>
        {['RÉCENT', 'FAVORI', 'TÉLÉCHARGEMENTS', 'DÉBLOQUÉ', 'COMMENTAIRES'].map(tab => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...s.tab,
              color: activeTab === tab ? '#00f5d4' : '#666',
              borderBottom: activeTab === tab ? '2px solid #00f5d4' : 'none',
              textShadow: activeTab === tab ? '0 0 5px #00f5d4' : 'none'
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      <div style={s.stats}>
        🔄 63 SÉRIES AU TOTAL <span style={{ color: '#00f5d4', marginLeft: '10px', textShadow: '0 0 5px #00f5d4' }}>10 NON LUES</span>
      </div>

      {/* CONTENU */}
      <div style={s.content}>
        {activeTab === 'COMMENTAIRES' ? (
          <div style={s.commentNotice}>
            <p>📝 Vos commentaires s'affichent ici.</p>
            <p style={{ fontSize: '10px', color: '#888' }}>Modifiables pendant 3 jours après publication.</p>
          </div>
        ) : (
          myData.map(item => (
            <div key={item.id} style={s.card}>
              <img src={item.img} style={s.cover} />
              <div style={s.info}>
                <div style={{ ...s.itemTitle, textShadow: '0 0 5px #a855f7' }}>{item.title}</div>
                <div style={{ ...s.itemEp, color: '#ccc' }}>{item.ep}</div>
                <div style={{ ...s.itemDate, color: '#999' }}>{item.date}</div>
              </div>
              <button style={s.btnContinue} onClick={() => handleContinue(item)}>Continuer</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const s = {
  container: { minHeight: '100vh', color: '#fff', display: 'flex', flexDirection: 'column', padding: '15px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  headerIcons: { display: 'flex', gap: '15px' },
  topIcon: { fontSize: '20px', cursor: 'pointer', color: '#e0b3ff', textShadow: '0 0 5px #a855f7' },
  tabs: { display: 'flex', overflowX: 'auto', gap: '20px', paddingBottom: '10px', borderBottom: '1px solid #111', marginBottom: '10px' },
  tab: { fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap', paddingBottom: '5px', cursor: 'pointer' },
  stats: { padding: '5px 0', fontSize: '10px', color: '#555' },
  content: { flex: 1, overflowY: 'auto', paddingRight: '10px' },
  card: { display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', borderBottom: '1px solid #111', background: 'rgba(50,0,50,0.2)', borderRadius: '6px', marginBottom: '10px' },
  cover: { width: '50px', height: '70px', borderRadius: '4px', objectFit: 'cover', boxShadow: '0 0 10px #a855f7' },
  info: { flex: 1 },
  itemTitle: { fontSize: '14px', fontWeight: 'bold' },
  itemEp: { fontSize: '11px', marginTop: '3px' },
  itemDate: { fontSize: '10px' },
  btnContinue: { backgroundColor: '#111', border: '1px solid #333', color: '#00f5d4', padding: '5px 10px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', textShadow: '0 0 5px #00f5d4' },
  commentNotice: { textAlign: 'center', marginTop: '50px', color: '#ccc' }
};