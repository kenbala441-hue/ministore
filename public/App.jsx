import React, { useState, useEffect } from 'react';

// --- SERVICE WORKER (Option 2: Cache Hors-ligne) ---
// Ce code prépare ton app pour le mode hors-ligne sans PDF.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW error:', err));
  });
}

function App() {
  // --- ÉTATS GLOBAUX ---
  const [view, setView] = useState('home'); 
  const [theme, setTheme] = useState('dark'); 
  const [showBurger, setShowBurger] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [mySeriesTab, setMySeriesTab] = useState('fav'); // fav, recent, liked
  
  // --- SYSTÈME DE DONNÉES DYNAMIQUES ---
  const [user, setUser] = useState({
    name: "Manga Master", pseudo: "@MangaDev243", bio: "Artiste Webtoon", level: "Bronze"
  });

  // J'ai ajouté la propriété "banner" dans tes objets stories pour que le code de fusion fonctionne
  const [stories, setStories] = useState([
    { 
      id: 1, 
      title: "Urban Legends", 
      author: "MangaDev", 
      views: "12k", 
      type: 'Action', 
      color: '#a855f7', 
      banner: 'https://via.placeholder.com/400x200',
      content: "Chapitre 1: L'ombre de Kinshasa s'éveille...", 
      isFav: true, 
      isLiked: true 
    },
    { 
      id: 2, 
      title: "Shadow Hunter", 
      author: "Z-Art", 
      views: "85k", 
      type: 'Manga', 
      color: '#3b82f6', 
      banner: 'https://via.placeholder.com/400x200',
      content: "L'arc final commence maintenant !", 
      isFav: false, 
      isLiked: true 
    }
  ]);

  // --- THÈME & STYLES ---
  const t = {
    bg: theme === 'dark' ? '#0a0a0a' : '#ffffff',
    txt: theme === 'dark' ? '#ffffff' : '#000000',
    card: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
    accent: '#a855f7', // Violet ComicCraft
    sub: theme === 'dark' ? '#777' : '#888',
    font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  // --- LOGIQUE ACTIONS ---
  const toggleFav = (id) => {
    setStories(stories.map(s => s.id === id ? {...s, isFav: !s.isFav} : s));
  };

  const deleteFromSeries = (id) => {
    if(window.confirm("Supprimer de votre bibliothèque ?")) {
      setStories(stories.map(s => s.id === id ? {...s, isFav: false, isLiked: false} : s));
    }
  };

  // --- COMPOSANTS INTERNES ---

  const BurgerMenu = () => (
    <div style={{ position: 'fixed', top: 0, right: showBurger ? 0 : '-100%', width: '80%', height: '100%', backgroundColor: t.card, zIndex: 1000, transition: '0.3s', padding: '20px', boxShadow: '-5px 0 15px rgba(0,0,0,0.5)' }}>
      <button onClick={() => setShowBurger(false)} style={{ background: 'none', border: 'none', color: t.accent, fontSize: '24px' }}>✕</button>
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: t.accent, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
        <h4 style={{ margin: '10px 0 0', fontSize: '14px' }}>{user.name}</h4>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div onClick={() => {setView('profile'); setShowBurger(false)}} style={s.menuItem(t)}>👤 Mon Profil</div>
        <div onClick={() => alert("Support: +243 000 000")} style={s.menuItem(t)}>📧 Contact</div>
        <div onClick={() => alert("ComicCraft v1.0 Bêta")} style={s.menuItem(t)}>ℹ️ À propos</div>
        <div onClick={() => setView('privacy')} style={s.menuItem(t)}>🔒 Confidentialité</div>
        <div onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={s.menuItem(t)}>🌓 Mode {theme === 'dark' ? 'Jour' : 'Nuit'}</div>
      </div>
    </div>
  );

  const MySeriesScreen = () => (
    <div style={{ padding: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', borderBottom: `1px solid ${t.sub}`, marginBottom: '15px' }}>
        {['fav', 'recent', 'liked'].map(tab => (
          <button key={tab} onClick={() => setMySeriesTab(tab)} style={{ background: 'none', border: 'none', color: mySeriesTab === tab ? t.accent : t.sub, borderBottom: mySeriesTab === tab ? `2px solid ${t.accent}` : 'none', padding: '10px', fontSize: '12px', textTransform: 'uppercase' }}>
            {tab === 'fav' ? 'Favoris' : tab === 'recent' ? 'Récents' : 'Aimés'}
          </button>
        ))}
      </div>
      {stories.filter(s => (mySeriesTab === 'fav' ? s.isFav : s.isLiked)).map(s => (
        <div key={s.id} style={{ display: 'flex', backgroundColor: t.card, borderRadius: '8px', padding: '10px', marginBottom: '10px', alignItems: 'center' }}>
          <div style={{ width: '50px', height: '70px', backgroundColor: s.color, borderRadius: '4px', marginRight: '10px' }}></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{s.title}</div>
            <div style={{ fontSize: '11px', color: t.sub }}>{s.author}</div>
          </div>
          <button onClick={() => deleteFromSeries(s.id)} style={{ background: 'none', border: 'none', color: '#ff4444' }}>🗑️</button>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ backgroundColor: t.bg, color: t.txt, minHeight: '100vh', fontFamily: t.font, overflowX: 'hidden' }}>
      <BurgerMenu />
      
      {/* HEADER DYNAMIQUE */}
      <header style={{ padding: '10px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `0.5px solid ${t.card}`, position: 'sticky', top: 0, backgroundColor: t.bg, zIndex: 90 }}>
        <h1 style={{ fontSize: '18px', color: t.accent, margin: 0 }}>ComicCraft</h1>
        <button onClick={() => setShowBurger(true)} style={{ background: 'none', border: 'none', fontSize: '20px', color: t.txt }}>☰</button>
      </header>

      {/* VUES PRINCIPALES */}
      <main style={{ paddingBottom: '100px' }}>
        {view === 'home' && (
          <div style={{ padding: '15px' }}>
            {/* FUSION : BANNIÈRE DYNAMIQUE */}
            <div style={{ 
              height: '180px', 
              borderRadius: '12px', 
              backgroundImage: `linear-gradient(to bottom, transparent, #000), url(${stories[0].banner})`, 
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: stories[0].color, 
              display: 'flex', 
              alignItems: 'flex-end', 
              padding: '15px', 
              marginBottom: '20px' 
            }}>
              {/* BOUTON LIRE CONNECTÉ */}
              <button 
                onClick={() => {setSelectedStory(stories[0]); setView('reader')}} 
                style={s.btnMain}>
                LIRE : {stories[0].title}
              </button>
            </div>
            
            <h3 style={{ fontSize: '16px' }}>Recommandés</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {stories.map(story => (
                <div key={story.id} onClick={() => {setSelectedStory(story); setView('reader')}} style={{ backgroundColor: t.card, borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ height: '120px', backgroundColor: story.color, backgroundImage: `url(${story.banner})`, backgroundSize: 'cover' }}></div>
                  <div style={{ padding: '8px', fontSize: '12px' }}>{story.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'news' && (
          <div style={{ padding: '15px' }}>
            <h3 style={{ fontSize: '16px', borderLeft: `3px solid ${t.accent}`, paddingLeft: '10px' }}>Nouveautés</h3>
            {stories.map(s => (
              <div key={s.id} style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ width: '80px', height: '80px', backgroundColor: s.color, borderRadius: '8px', backgroundImage: `url(${s.banner})`, backgroundSize: 'cover' }}></div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{s.title}</div>
                  <div style={{ fontSize: '11px', color: t.sub }}>Mise à jour: Il y a 2h</div>
                  <button onClick={() => {setSelectedStory(s); setView('reader')}} style={{ marginTop: '5px', padding: '5px 10px', backgroundColor: t.accent, border: 'none', borderRadius: '4px', color: '#fff', fontSize: '10px' }}>Lire le Chap. 13</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'myseries' && <MySeriesScreen />}
        
        {view === 'reader' && (
          <div style={{ padding: '15px' }}>
            <button onClick={() => setView('home')} style={{ color: t.accent, border: 'none', background: 'none' }}>← Retour</button>
            <h2 style={{ fontSize: '20px' }}>{selectedStory?.title}</h2>
            <p style={{ lineHeight: '1.6', fontSize: '14px' }}>{selectedStory?.content}</p>
            <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
              <button onClick={() => toggleFav(selectedStory.id)} style={{ background: 'none', border: 'none', color: selectedStory?.isFav ? t.accent : t.sub }}>{selectedStory?.isFav ? '❤️ Enregistré' : '🤍 Ajouter aux favoris'}</button>
              <button style={{ background: 'none', border: 'none', color: t.sub }}>📥 Télécharger</button>
            </div>
          </div>
        )}
      </main>

      {/* NAVIGATION WEBTOON STYLE */}
      <nav style={{ position: 'fixed', bottom: 0, width: '100%', height: '70px', backgroundColor: t.bg, borderTop: `0.5px solid ${t.card}`, display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 100 }}>
        <div onClick={() => setView('home')} style={s.navItem(view === 'home', t)}>🏠<br/><span style={{fontSize:'10px'}}>Accueil</span></div>
        <div onClick={() => setView('news')} style={s.navItem(view === 'news', t)}>🆕<br/><span style={{fontSize:'10px'}}>Nouveauté</span></div>
        <div style={{ width: '50px', height: '50px', backgroundColor: t.accent, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-30px', boxShadow: '0 4px 10px rgba(168, 85, 247, 0.4)', color: '#fff' }}>⚡</div>
        <div onClick={() => setView('myseries')} style={s.navItem(view === 'myseries', t)}>📚<br/><span style={{fontSize:'10px'}}>Séries</span></div>
      </nav>
    </div>
  );
}

const s = {
  menuItem: (t) => ({ padding: '15px', borderBottom: `0.5px solid ${t.bg}`, fontSize: '14px', cursor: 'pointer' }),
  navItem: (active, t) => ({ textAlign: 'center', color: active ? t.accent : t.sub, cursor: 'pointer', transition: '0.2s' }),
  btnMain: { backgroundColor: '#a855f7', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }
};

export default App;
