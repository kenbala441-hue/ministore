import React, { useState, useEffect } from 'react';
import { auth, loginWithGoogle } from './firebase'; // Importation de ta config Firebase
import { onAuthStateChanged, signOut } from 'firebase/auth';

// --- SERVICE WORKER (Option 2: Cache Hors-ligne) ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW error:', err));
  });
}

function App() {
  // --- ÉTATS D'AUTHENTIFICATION ---
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- ÉTATS GLOBAUX DE L'APP ---
  const [view, setView] = useState('home'); 
  const [theme, setTheme] = useState('dark'); 
  const [showBurger, setShowBurger] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [mySeriesTab, setMySeriesTab] = useState('fav');
  
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

  // --- SURVEILLANCE DE LA CONNEXION ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- THÈME & STYLES ---
  const t = {
    bg: theme === 'dark' ? '#0a0a0a' : '#ffffff',
    txt: theme === 'dark' ? '#ffffff' : '#000000',
    card: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
    accent: '#a855f7', 
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

  // --- ÉCRAN DE CHARGEMENT ---
  if (loading) return <div style={{backgroundColor: '#0a0a0a', height: '100vh', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Chargement...</div>;

  // --- 1. ÉCRAN DE LOGIN OBLIGATOIRE ---
  if (!user) {
    return (
      <div style={{ backgroundColor: '#0f0f15', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', fontFamily: 'Arial' }}>
        <h1 style={{ color: '#a855f7', fontSize: '32px', marginBottom: '10px' }}>ComicCraft</h1>
        <p style={{ marginBottom: '30px', color: '#777' }}>Connectez-vous pour lire vos mangas</p>
        <button 
          onClick={loginWithGoogle}
          style={{ padding: '15px 30px', backgroundColor: '#a855f7', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)' }}
        >
          Se connecter avec Google
        </button>
      </div>
    );
  }

  // --- 2. APPLICATION COMPLÈTE (SI CONNECTÉ) ---
  return (
    <div style={{ backgroundColor: t.bg, color: t.txt, minHeight: '100vh', fontFamily: t.font, overflowX: 'hidden' }}>
      
      {/* MENU BURGER */}
      <div style={{ position: 'fixed', top: 0, right: showBurger ? 0 : '-100%', width: '80%', height: '100%', backgroundColor: t.card, zIndex: 1000, transition: '0.3s', padding: '20px', boxShadow: '-5px 0 15px rgba(0,0,0,0.5)' }}>
        <button onClick={() => setShowBurger(false)} style={{ background: 'none', border: 'none', color: t.accent, fontSize: '24px' }}>✕</button>
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <img src={user.photoURL} alt="Profil" style={{ width: '60px', height: '60px', borderRadius: '50%', border: `2px solid ${t.accent}` }} />
          <h4 style={{ margin: '10px 0 0', fontSize: '14px' }}>{user.displayName}</h4>
          <p style={{fontSize: '10px', color: t.sub}}>{user.email}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div onClick={() => {setTheme(theme === 'dark' ? 'light' : 'dark')}} style={s.menuItem(t)}>🌓 Mode {theme === 'dark' ? 'Jour' : 'Nuit'}</div>
          <div onClick={() => signOut(auth)} style={{...s.menuItem(t), color: 'red'}}>🚪 Déconnexion</div>
        </div>
      </div>

      {/* HEADER */}
      <header style={{ padding: '10px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `0.5px solid ${t.card}`, position: 'sticky', top: 0, backgroundColor: t.bg, zIndex: 90 }}>
        <h1 style={{ fontSize: '18px', color: t.accent, margin: 0 }}>ComicCraft</h1>
        <button onClick={() => setShowBurger(true)} style={{ background: 'none', border: 'none', fontSize: '20px', color: t.txt }}>☰</button>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main style={{ paddingBottom: '100px' }}>
        {view === 'home' && (
          <div style={{ padding: '15px' }}>
            <div style={{ height: '180px', borderRadius: '12px', backgroundImage: `linear-gradient(to bottom, transparent, #000), url(${stories[0].banner})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'flex-end', padding: '15px', marginBottom: '20px' }}>
              <button onClick={() => {setSelectedStory(stories[0]); setView('reader')}} style={s.btnMain}>LIRE : {stories[0].title}</button>
            </div>
            <h3 style={{ fontSize: '16px' }}>Recommandés</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {stories.map(story => (
                <div key={story.id} onClick={() => {setSelectedStory(story); setView('reader')}} style={{ backgroundColor: t.card, borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ height: '120px', backgroundColor: story.color }}></div>
                  <div style={{ padding: '8px', fontSize: '12px' }}>{story.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'myseries' && (
           <div style={{ padding: '10px' }}>
              <h3 style={{textAlign: 'center'}}>Ma Bibliothèque</h3>
              {stories.filter(s => s.isFav).map(s => (
                <div key={s.id} style={{ display: 'flex', backgroundColor: t.card, borderRadius: '8px', padding: '10px', marginBottom: '10px', alignItems: 'center' }}>
                  <div style={{ width: '50px', height: '70px', backgroundColor: s.color, borderRadius: '4px', marginRight: '10px' }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{s.title}</div>
                  </div>
                  <button onClick={() => deleteFromSeries(s.id)} style={{ background: 'none', border: 'none', color: '#ff4444' }}>🗑️</button>
                </div>
              ))}
           </div>
        )}

        {view === 'reader' && (
          <div style={{ padding: '15px' }}>
            <button onClick={() => setView('home')} style={{ color: t.accent, border: 'none', background: 'none', marginBottom: '10px' }}>← Retour</button>
            <h2 style={{ fontSize: '20px' }}>{selectedStory?.title}</h2>
            <p style={{ lineHeight: '1.6', fontSize: '14px' }}>{selectedStory?.content}</p>
          </div>
        )}
      </main>

      {/* BARRE DE NAVIGATION BASSE */}
      <nav style={{ position: 'fixed', bottom: 0, width: '100%', height: '70px', backgroundColor: t.bg, borderTop: `0.5px solid ${t.card}`, display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 100 }}>
        <div onClick={() => setView('home')} style={s.navItem(view === 'home', t)}>🏠<br/><span style={{fontSize:'10px'}}>Accueil</span></div>
        <div style={{ width: '50px', height: '50px', backgroundColor: t.accent, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-30px', color: '#fff' }}>⚡</div>
        <div onClick={() => setView('myseries')} style={s.navItem(view === 'myseries', t)}>📚<br/><span style={{fontSize:'10px'}}>Séries</span></div>
      </nav>
    </div>
  );
}

const s = {
  menuItem: (t) => ({ padding: '15px', borderBottom: `0.5px solid #333`, fontSize: '14px', cursor: 'pointer' }),
  navItem: (active, t) => ({ textAlign: 'center', color: active ? t.accent : t.sub, cursor: 'pointer' }),
  btnMain: { backgroundColor: '#a855f7', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold', fontSize: '12px' }
};

export default App;