import React, { useState, useEffect } from 'react';

const GENRES = ["Tous", "Action", "Horreur", "Romance", "Aventure", "Sci-Fi", "Drame"];

export default function Home({ setView, setSelectedStory, toggleBurger }) {
  const [stories, setStories] = useState([]);
  const [activeGenre, setActiveGenre] = useState("Tous");
  const [notifCount, setNotifCount] = useState(3); // Exemple de notifications

  useEffect(() => {
    // Logique de rafraîchissement
    const shuffled = [...MOCK_DATA].sort(() => 0.5 - Math.random());
    setStories(shuffled);
  }, []);

  return (
    <div style={s.container}>
      
      {/* --- HEADER SUPÉRIEUR --- */}
      <header style={s.header}>
        <div style={s.headerLeft} onClick={toggleBurger}>
          <div style={s.burgerIcon}>☰</div>
          <h1 style={s.logoText}>Comic<span style={{color:'#fff'}}>Craft</span></h1>
        </div>
        
        <div style={s.headerRight}>
          <div style={s.notifWrapper} onClick={() => setView('notifications')}>
            <span style={s.icon}>🔔</span>
            {notifCount > 0 && <span style={s.badge}>{notifCount}</span>}
          </div>
          <div style={s.searchIcon} onClick={() => setView('search')}>🔍</div>
        </div>
      </header>

      {/* --- NAVIGATION RAPIDE (Tabs) --- */}
      <div style={s.tabs}>
        <span style={s.tabActive} onClick={() => setView('home')}>ACCUEIL</span>
        <span style={s.tab} onClick={() => setView('news')}>NOUVEAUTÉS</span>
        <span style={s.tab} onClick={() => setView('myseries')}>MES SÉRIES</span>
      </div>

      {/* --- FILTRE GENRES --- */}
      <div style={s.genreScroll}>
        {GENRES.map(g => (
          <button 
            key={g} 
            onClick={() => setActiveGenre(g)}
            style={activeGenre === g ? s.genreBtnActive : s.genreBtn}
          >
            {g}
          </button>
        ))}
      </div>

      {/* --- BANNIÈRE HÉRO --- */}
      <section style={s.heroSection} onClick={() => {setSelectedStory(stories[0]); setView('reader')}}>
        {stories[0] && (
          <>
            <img src={stories[0].banner} style={s.heroImg} alt="banner" />
            <div style={s.heroOverlay}>
              <div style={s.tag}>⭐ RECOMMANDÉ POUR VOUS</div>
              <h2 style={s.heroTitle}>{stories[0].title}</h2>
              <p style={s.heroSub}>{stories[0].genre} • 🔥 Popularité Élevée</p>
            </div>
          </>
        )}
      </section>

      {/* --- GRILLE DYNAMIQUE --- */}
      <div style={s.sectionHeader}>
        <h3 style={s.sectionTitle}>Tendances Actuelles</h3>
        <span style={s.seeMore} onClick={() => setView('news')}>Voir tout {'>'} </span>
      </div>

      <div style={s.grid}>
        {stories.filter(st => activeGenre === "Tous" || st.genre === activeGenre).map(story => (
          <div key={story.id} style={s.card} onClick={() => {setSelectedStory(story); setView('reader')}}>
            <div style={{...s.cardThumb, border: `1px solid ${story.color}44`}}>
              <img src={story.banner} style={s.thumbImg} alt="cover" />
              <div style={s.viewCount}>👁️ {story.views}</div>
            </div>
            <div style={s.cardInfo}>
              <div style={s.cardTitle}>{story.title}</div>
              <div style={s.cardMeta}>{story.genre}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- STYLES AMÉLIORÉS ---
const s = {
  container: { backgroundColor: '#050505', minHeight: '100vh', padding: '0 15px 100px 15px', color: 'white', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', position: 'sticky', top: 0, backgroundColor: '#050505', zIndex: 10 },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '15px' },
  burgerIcon: { fontSize: '24px', color: '#a855f7' },
  logoText: { fontSize: '20px', fontWeight: 'bold', color: '#a855f7', margin: 0 },
  headerRight: { display: 'flex', gap: '20px', alignItems: 'center' },
  notifWrapper: { position: 'relative', fontSize: '20px' },
  badge: { position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#ff0000', color: 'white', fontSize: '10px', padding: '2px 5px', borderRadius: '50%', fontWeight: 'bold' },
  searchIcon: { fontSize: '18px' },
  
  tabs: { display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid #1a1a1a' },
  tabActive: { color: '#a855f7', borderBottom: '2px solid #a855f7', paddingBottom: '10px', fontSize: '12px', fontWeight: 'bold' },
  tab: { color: '#555', paddingBottom: '10px', fontSize: '12px' },

  genreScroll: { display: 'flex', overflowX: 'auto', gap: '10px', paddingBottom: '20px', scrollbarWidth: 'none' },
  genreBtn: { padding: '8px 16px', borderRadius: '20px', border: '1px solid #222', backgroundColor: '#111', color: '#888', whiteSpace: 'nowrap', fontSize: '11px' },
  genreBtnActive: { padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: '#a855f7', color: 'white', whiteSpace: 'nowrap', fontSize: '11px', boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)' },

  heroSection: { position: 'relative', height: '220px', borderRadius: '20px', overflow: 'hidden', marginBottom: '30px' },
  heroImg: { width: '100%', height: '100%', objectFit: 'cover' },
  heroOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(transparent, rgba(0,0,0,0.95))' },
  tag: { fontSize: '9px', color: '#a855f7', fontWeight: 'bold', marginBottom: '5px' },
  heroTitle: { fontSize: '22px', margin: '0 0 5px 0' },
  heroSub: { fontSize: '12px', color: '#888' },

  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  sectionTitle: { fontSize: '16px', color: '#fff', margin: 0 },
  seeMore: { fontSize: '11px', color: '#a855f7' },

  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' },
  card: { cursor: 'pointer' },
  cardThumb: { height: '140px', borderRadius: '12px', overflow: 'hidden', position: 'relative', backgroundColor: '#111' },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover' },
  viewCount: { position: 'absolute', bottom: '5px', left: '5px', fontSize: '9px', background: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '10px' },
  cardInfo: { marginTop: '8px' },
  cardTitle: { fontSize: '11px', fontWeight: 'bold', color: '#eee', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxDirection: 'vertical', overflow: 'hidden' },
  cardMeta: { fontSize: '9px', color: '#555', marginTop: '3px' }
};

// Données de test
const MOCK_DATA = [
  { id: 1, title: "Shadow Hunter", genre: "Action", rating: "4.8", views: "1.2M", color: "#6366f1", banner: "https://picsum.photos/400/220?sig=11" },
  { id: 2, title: "Neon Romance", genre: "Romance", rating: "4.5", views: "800k", color: "#ec4899", banner: "https://picsum.photos/400/220?sig=22" },
  { id: 3, title: "Ghost City", genre: "Horreur", rating: "4.9", views: "2M", color: "#a855f7", banner: "https://picsum.photos/400/220?sig=33" },
  { id: 4, title: "L'Épée Perdue", genre: "Aventure", rating: "4.2", views: "500k", color: "#eab308", banner: "https://picsum.photos/400/220?sig=44" },
  { id: 5, title: "Cyber Mind", genre: "Sci-Fi", rating: "4.7", views: "900k", color: "#00fff2", banner: "https://picsum.photos/400/220?sig=55" },
  { id: 6, title: "Blue Lock", genre: "Sport", rating: "4.9", views: "3M", color: "#3b82f6", banner: "https://picsum.photos/400/220?sig=66" },
];
