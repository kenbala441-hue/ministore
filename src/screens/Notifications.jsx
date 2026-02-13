import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function Notifications({ setView }) {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, studio, social, system

  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(notifs);
    });
    return () => unsubscribe();
  }, []);

  // Filtrage des notifications locales
  const filteredNotifs = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.category === filter;
  });

  return (
    <div style={s.container}>
      {/* HEADER FUTURISTE */}
      <div style={s.header}>
        <button onClick={() => setView('home')} style={s.backBtn}>←</button>
        <h2 style={s.glitchTitle}>FLUX NEURAL</h2>
      </div>

      {/* FILTRES / CATÉGORIES */}
      <div style={s.tabs}>
        {['all', 'studio', 'social', 'system'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              ...s.tabBtn,
              color: filter === tab ? '#00f5d4' : '#666',
              borderBottom: filter === tab ? '2px solid #00f5d4' : '2px solid transparent'
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* LISTE DES NOTIFICATIONS STYLE "INTERFACE DE HACK" */}
      <div style={s.list}>
        {filteredNotifs.length === 0 ? (
          <div style={s.emptyState}>
            <div style={s.radar}></div>
            <p>AUCUN SIGNAL DÉTECTÉ...</p>
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <div 
              key={notif.id} 
              style={{...s.card, borderColor: getCategoryColor(notif.category)}}
              onClick={() => notif.targetView && setView(notif.targetView)}
            >
              <div style={s.cardHeader}>
                <span style={{...s.categoryTag, color: getCategoryColor(notif.category)}}>
                  [{notif.category || 'INFO'}]
                </span>
                <span style={s.date}>
                  {notif.timestamp ? new Date(notif.timestamp.toDate()).toLocaleTimeString() : 'NOW'}
                </span>
              </div>
              <p style={s.message}>{notif.message}</p>
              <div style={{...s.glowEffect, backgroundColor: getCategoryColor(notif.category)}}></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Fonction pour définir les couleurs par type
const getCategoryColor = (cat) => {
  switch(cat) {
    case 'studio': return '#a855f7'; // Violet Studio
    case 'social': return '#38bdf8'; // Bleu Amis
    case 'system': return '#ff0055'; // Rouge Alerte/MAJ
    default: return '#00f5d4'; // Cyan par défaut
  }
};

const s = {
  container: { padding: '20px', minHeight: '100vh', background: 'radial-gradient(circle at top, #0a0a20, #000)', color: 'white' },
  header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' },
  backBtn: { background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' },
  glitchTitle: { fontSize: '18px', letterSpacing: '4px', fontWeight: 'bold', color: '#00f5d4', textShadow: '0 0 10px #00f5d444' },
  tabs: { display: 'flex', justifyContent: 'space-between', marginBottom: '25px', borderBottom: '1px solid #222' },
  tabBtn: { background: 'none', border: 'none', padding: '10px 5px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px', transition: '0.3s' },
  list: { display: 'flex', flexDirection: 'column', gap: '15px' },
  card: {
    padding: '15px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '4px',
    borderLeft: '4px solid',
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  categoryTag: { fontSize: '10px', fontWeight: 'bold' },
  date: { fontSize: '9px', color: '#444' },
  message: { fontSize: '13px', color: '#ccc', lineHeight: '1.4' },
  glowEffect: { position: 'absolute', top: 0, right: 0, width: '40px', height: '40px', filter: 'blur(30px)', opacity: 0.15 },
  emptyState: { textAlign: 'center', marginTop: '100px', opacity: 0.5 },
  radar: { width: '50px', height: '50px', border: '1px solid #00f5d4', borderRadius: '50%', margin: '0 auto 20px', borderStyle: 'dashed' }
};
