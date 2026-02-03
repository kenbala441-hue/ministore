import React, { useState } from 'react'

// --- [SECTION 1 : COMPOSANTS DE NAVIGATION & MENUS] ---

const ActionMenu = ({ isOpen, setView, setShowActionMenu, t }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#0a0a0a', border: `1px solid ${t.border}`, borderRadius: '24px', width: '280px', zIndex: 4000, boxShadow: '0 10px 50px rgba(0,0,0,0.9)', padding: '8px' }}>
      <div onClick={() => {setView('studio'); setShowActionMenu(false)}} style={{ padding: '16px', color: '#fff', textAlign: 'center', borderBottom: '1px solid #1a1a1a', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>🎨 Studio (Créer)</div>
      <div onClick={() => {setView('messenger'); setShowActionMenu(false)}} style={{ padding: '16px', color: '#fff', textAlign: 'center', borderBottom: '1px solid #1a1a1a', fontSize: '14px', cursor: 'pointer' }}>💬 Messenger Social</div>
      <div onClick={() => setShowActionMenu(false)} style={{ padding: '12px', color: t.border, textAlign: 'center', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>RETOUR</div>
    </div>
  );
};

const SideMenu = ({ isOpen, onClose, setView, theme, setTheme, t }) => {
  if (!isOpen) return null;
  const menuItems = [
    { label: "Confidentialité", icon: "🔒" }, { label: "Nous contacter", icon: "📧" },
    { label: "À propos", icon: "ℹ️" }, { label: "Règles communautaires", icon: "📜" },
    { label: "Langue (Français)", icon: "🌐" }, { label: "Paramètres Avancés", icon: "⚙️" }
  ];
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 6000, display: 'flex' }}>
      <div onClick={onClose} style={{ flex: 1, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />
      <div style={{ width: '280px', background: '#0a0a0a', height: '100%', padding: '20px', borderLeft: `1px solid ${t.border}44` }}>
        <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Menu</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#111', borderRadius: '12px', marginBottom: '20px' }}>
          <span style={{ fontSize: '13px' }}>Mode Sombre</span>
          <div onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ width: '40px', height: '20px', background: t.border, borderRadius: '10px', position: 'relative' }}>
            <div style={{ position: 'absolute', right: '2px', top: '2px', width: '16px', height: '16px', background: '#fff', borderRadius: '50%' }} />
          </div>
        </div>
        {menuItems.map((item, i) => (
          <div key={i} style={{ padding: '15px 0', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: '15px', fontSize: '14px' }}>
            {item.icon} {item.label}
          </div>
        ))}
        <div onClick={() => alert('Déconnecté')} style={{ marginTop: '30px', color: '#ff4444' }}>🚪 Déconnexion</div>
      </div>
    </div>
  );
};

// --- [SECTION 2 : L'APPLICATION PRINCIPALE] ---

export default function App() {
  const [view, setView] = useState('home');
  const [theme, setTheme] = useState('dark');
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [evalResult, setEvalResult] = useState("");
  const [userCoins, setUserCoins] = useState(150);

  const t = {
    bg: theme === 'dark' ? '#000' : '#fff',
    txt: theme === 'dark' ? '#fff' : '#000',
    card: theme === 'dark' ? '#0d0d0d' : '#f5f5f5',
    border: '#a855f7',
    sub: '#888'
  };

  const stories = [
    { id: 1, title: "Urban Legends", author: "MangaDev", chapters: "Chapitre 1", rating: 4.8, color: '#a855f7', content: "La foudre déchire le ciel au-dessus de la ville..." },
    { id: 2, title: "Shadow Hunter", author: "Z-Art", chapters: "Chapitre 1", rating: 4.9, color: '#3b82f6', content: "Les ombres cachent des secrets ancestraux..." }
  ];

  const handleRate = (score) => {
    setUserRating(score);
    if (score >= 8) setEvalResult("🔥 EXCELLENT (Avis Positif)");
    else if (score >= 5) setEvalResult("⚖️ MOYEN (Avis Neutre)");
    else setEvalResult("❌ DÉCEVANT (Avis Négatif)");
  };

  // --- ÉCRAN : BOUTIQUE (15 items) ---
  const ShopView = () => {
    const packs = [
      { c: 10, p: "0.99€" }, { c: 50, p: "4.99€" }, { c: 100, p: "8.99€" },
      { c: 200, p: "15.99€" }, { c: 500, p: "35.00€" }, { c: 1000, p: "60.00€" }
    ];
    const items = ["Badge Fan", "Ticket FastPass", "Avatar VIP", "Couleur Nom", "Emoji Perso", "Sans Pub (30j)", "Fond Profil", "Boost Auteur", "Archive Totale"];
    
    return (
      <div style={{ padding: '20px', paddingBottom: '120px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <button onClick={() => setView('profile')} style={{ background: 'none', border: 'none', color: t.border, fontSize: '24px' }}>←</button>
          <h1 style={{ marginLeft: '15px', fontSize: '20px' }}>Boutique de Pièces</h1>
        </div>
        <div style={{ background: t.card, padding: '20px', borderRadius: '20px', textAlign: 'center', border: `1px solid ${t.border}` }}>
          <span style={{ fontSize: '12px', color: t.sub }}>SOLDE ACTUEL</span>
          <h2 style={{ fontSize: '30px', margin: '5px 0' }}>{userCoins} 🪙</h2>
        </div>
        <h3 style={{ marginTop: '25px', fontSize: '14px', color: t.border }}>RECHARGER</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
          {packs.map((pkg, i) => (
            <div key={i} style={{ background: t.card, padding: '15px', borderRadius: '15px', textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold' }}>{pkg.c} Coins</div>
              <button style={{ background: t.border, border: 'none', color: '#fff', padding: '5px 10px', borderRadius: '8px', marginTop: '10px', fontSize: '12px' }}>{pkg.p}</button>
            </div>
          ))}
        </div>
        <h3 style={{ marginTop: '25px', fontSize: '14px', color: t.border }}>ARTICLES SPÉCIAUX</h3>
        <div style={{ marginTop: '10px' }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #222' }}>
              <span>{it}</span> <span style={{ color: t.border }}>50 🪙</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- RENDU DES VUES ---
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: t.bg, color: t.txt, fontFamily: 'sans-serif', overflowY: 'auto' }}>
      
      {view === 'home' && (
        <div style={{ padding: '20px', paddingBottom: '120px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h1 style={{ color: t.border, fontSize: '22px', fontWeight: '900' }}>Comiccrafte</h1>
            <span style={{ fontSize: '24px' }}>🔔</span>
          </div>
          <div style={{ border: `2px solid ${t.border}`, borderRadius: '25px', padding: '30px', textAlign: 'center', boxShadow: `0 0 20px ${t.border}33` }}>
            <h2>Urban Legends</h2>
            <button onClick={() => {setSelectedStory(stories[0]); setView('reader');}} style={{ background: t.border, color: '#fff', border: 'none', padding: '10px 30px', borderRadius: '15px', marginTop: '15px' }}>LIRE</button>
          </div>
          <div style={{ marginTop: '30px' }}>
            <h3>Populaires</h3>
            {stories.map(s => (
              <div key={s.id} onClick={() => { setSelectedStory(s); setView('reader'); }} style={{ background: t.card, padding: '15px', borderRadius: '15px', marginBottom: '10px', display: 'flex', gap: '15px' }}>
                <div style={{ width: '50px', height: '50px', background: s.color, borderRadius: '8px' }} />
                <div><b>{s.title}</b><div style={{ fontSize: '12px', color: t.sub }}>{s.author}</div></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'profile' && (
        <div style={{ padding: '20px', paddingBottom: '120px' }}>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <div style={{ width: '80px', height: '80px', background: t.border, borderRadius: '50%', margin: '0 auto', fontSize: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
            <h2 style={{ marginTop: '10px' }}>Auteur_Anonyme</h2>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', margin: '25px 0', background: t.card, padding: '15px', borderRadius: '15px' }}>
            <div style={{ textAlign: 'center' }}><b>{userCoins}</b><br/><small>COINS</small></div>
            <div style={{ textAlign: 'center' }}><b>12</b><br/><small>LU</small></div>
            <div style={{ textAlign: 'center' }}><b>4</b><br/><small>FANS</small></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div onClick={() => setView('shop')} style={{ background: t.card, padding: '15px', borderRadius: '15px', textAlign: 'center' }}>🛒 Boutique</div>
            <div style={{ background: t.card, padding: '15px', borderRadius: '15px', textAlign: 'center' }}>🏆 Missions</div>
            <div style={{ background: t.card, padding: '15px', borderRadius: '15px', textAlign: 'center' }}>📅 Assiduité</div>
            <div style={{ background: t.card, padding: '15px', borderRadius: '15px', textAlign: 'center' }}>🎁 Cadeaux</div>
          </div>
          <div style={{ marginTop: '20px', background: t.border, padding: '15px', borderRadius: '15px', textAlign: 'center' }}>DEVENIR CRÉATEUR 🚀</div>
        </div>
      )}

      {view === 'shop' && <ShopView />}
      
      {view === 'reader' && (
        <div style={{ paddingBottom: '120px' }}>
          <div style={{ padding: '20px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #1a1a1a' }}>
            <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', color: t.border, fontSize: '24px' }}>←</button>
            <b style={{ marginLeft: '15px' }}>{selectedStory?.title}</b>
          </div>
          <div style={{ padding: '30px', fontSize: '17px', lineHeight: '1.8' }}>{selectedStory?.content}</div>
          <div style={{ padding: '20px', background: '#0a0a0a', margin: '15px', borderRadius: '20px', textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: '5px', overflowX: 'auto' }}>
              {[...Array(10)].map((_, i) => (
                <button key={i} onClick={() => handleRate(i + 1)} style={{ minWidth: '38px', height: '38px', background: userRating === i+1 ? t.border : '#1a1a1a', border: 'none', borderRadius: '10px', color: '#fff' }}>{i + 1}</button>
              ))}
            </div>
            {evalResult && <div style={{ marginTop: '10px', color: t.border, fontWeight: 'bold' }}>{evalResult}</div>}
          </div>
        </div>
      )}

      {/* OVERLAYS ET NAVIGATION */}
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} setView={setView} theme={theme} setTheme={setTheme} t={t} />
      <ActionMenu isOpen={showActionMenu} setView={setView} setShowActionMenu={setShowActionMenu} t={t} />

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '80px', background: '#050505', borderTop: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 5000 }}>
        <div onClick={() => setView('home')} style={{ textAlign: 'center', color: view === 'home' ? t.border : '#fff' }}>🏠<br/><span style={{fontSize:'10px'}}>Accueil</span></div>
        <div onClick={() => setView('home')} style={{ textAlign: 'center', color: '#fff' }}>🔍<br/><span style={{fontSize:'10px'}}>Explorer</span></div>
        <div onClick={() => setShowActionMenu(!showActionMenu)} style={{ width: '55px', height: '55px', background: t.border, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-35px', border: '4px solid #000' }}>⚡</div>
        <div onClick={() => setView('profile')} style={{ textAlign: 'center', color: view === 'profile' ? t.border : '#fff' }}>👤<br/><span style={{fontSize:'10px'}}>Profil</span></div>
        <div onClick={() => setIsMenuOpen(true)} style={{ textAlign: 'center', color: '#fff' }}>☰<br/><span style={{fontSize:'10px'}}>Menu</span></div>
      </nav>
    </div>
  );
}
