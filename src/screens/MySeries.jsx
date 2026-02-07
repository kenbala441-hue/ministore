
import React, { useState } from 'react';

export default function MySeries({ setView }) {
  const [activeTab, setActiveTab] = useState('RÉCENT');

  const myData = [
    { id: 1, title: "Villain To Kill", ep: "Ep.187", date: "Lu il y a 53 jours", img: "https://picsum.photos/200/300?sig=1" },
    { id: 2, title: "Nano Machine", ep: "Ep.152", date: "Lu il y a 10 jours", img: "https://picsum.photos/200/300?sig=2" }
  ];

  return (
    <div style={s.container}>
      {/* HEADER AVEC BOUTONS GESTION */}
      <div style={s.header}>
        <h2 style={{fontSize: '22px'}}>Mes Séries</h2>
        <div style={s.headerIcons}>
          <span onClick={() => alert('Mode suppression actif')} style={s.topIcon}>🗑️</span>
          <span onClick={() => setView('store')} style={s.topIcon}>🪙</span> {/* BOUTON BOUTIQUE */}
          <span style={s.topIcon}>⋮</span>
        </div>
      </div>

      {/* ONGLETS INTERACTIFS */}
      <div style={s.tabs}>
        {['RÉCENT', 'FAVORI', 'TÉLÉCHARGEMENTS', 'DÉBLOQUÉ', 'COMMENTAIRES'].map(tab => (
          <div 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            style={{
              ...s.tab, 
              color: activeTab === tab ? '#fff' : '#666',
              borderBottom: activeTab === tab ? '2px solid #00f5d4' : 'none'
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      <div style={s.stats}>🔄 63 SÉRIES AU TOTAL <span style={{color:'#00f5d4', marginLeft:'10px'}}>10 NON LUES</span></div>

      {/* LISTE DES SÉRIES / COMMENTAIRES */}
      <div style={s.content}>
        {activeTab === 'COMMENTAIRES' ? (
          <div style={s.commentNotice}>
            <p>📝 Vos commentaires s'affichent ici.</p>
            <p style={{fontSize:'10px', color:'#444'}}>Modifiables pendant 3 jours après publication.</p>
          </div>
        ) : (
          myData.map(item => (
            <div key={item.id} style={s.card}>
              <img src={item.img} style={s.cover} />
              <div style={s.info}>
                <div style={s.itemTitle}>{item.title}</div>
                <div style={s.itemEp}>{item.ep}</div>
                <div style={s.itemDate}>{item.date}</div>
              </div>
              <button style={s.btnContinue}>Continuer</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const s = {
  container: { backgroundColor: '#000', minHeight: '100vh', color: '#fff' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px' },
  headerIcons: { display: 'flex', gap: '15px' },
  topIcon: { fontSize: '20px', cursor: 'pointer' },
  tabs: { display: 'flex', overflowX: 'auto', gap: '20px', padding: '10px 20px', borderBottom: '1px solid #111' },
  tab: { fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap', paddingBottom: '5px' },
  stats: { padding: '10px 20px', fontSize: '10px', color: '#555', backgroundColor: '#050505' },
  content: { padding: '10px' },
  card: { display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 0', borderBottom: '1px solid #111' },
  cover: { width: '50px', height: '70px', borderRadius: '4px', objectFit: 'cover' },
  info: { flex: 1 },
  itemTitle: { fontSize: '14px', fontWeight: 'bold' },
  itemEp: { fontSize: '11px', color: '#666', marginTop: '3px' },
  itemDate: { fontSize: '10px', color: '#444' },
  btnContinue: { backgroundColor: '#111', border: '1px solid #333', color: '#888', padding: '5px 10px', borderRadius: '4px', fontSize: '10px' },
  commentNotice: { textAlign: 'center', marginTop: '50px', color: '#333' }
};
