import React, { useState, useEffect } from 'react';

// Simulation de ta base de données d'applications
const APPS_DATABASE = [
  { id: 1, name: "ComicCraft Reader", version: "1.0.5", size: "25MB", icon: "⚡", category: "Outils", rating: "4.9", isInstalled: true },
  { id: 2, name: "Shadow Hunter Game", version: "2.1.0", size: "120MB", icon: "⚔️", category: "Action", rating: "4.7", isInstalled: false },
  { id: 3, name: "Z-Art Community", version: "1.0.0", size: "45MB", icon: "🎨", category: "Social", rating: "4.5", isInstalled: false },
];

const CATEGORIES = [
  { n: "Action", i: "🚁" }, { n: "Aventure", i: "🧭" }, 
  { n: "Social", i: "👥" }, { n: "Outils", i: "🛠️" }
];

export default function Store() {
  const [apps, setApps] = useState([]);
  
  // Simulation d'actualisation à l'ouverture
  useEffect(() => {
    setApps([...APPS_DATABASE].sort(() => 0.5 - Math.random()));
  }, []);

  const handleDownload = (app) => {
    alert(`Téléchargement de ${app.name} v${app.version}...`);
    // Ici la logique de mise à jour APK
  };

  return (
    <div style={s.container}>
      {/* HEADER : On enlève le logo de droite comme demandé */}
      <div style={s.searchBar}>
        <span>🔍 Rechercher des applis...</span>
      </div>

      <div style={s.navTabs}>
        <span style={s.tabActive}>Pour vous</span>
        <span style={s.tab}>Classements</span>
        <span style={s.tab}>Enfants</span>
      </div>

      {/* BANNIÈRE STYLE PLAYSTORE */}
      <div style={s.heroCard}>
        <div style={s.heroText}>
          <h3 style={{margin:0}}>L'événement "Comic Update" est là !</h3>
          <button style={s.installBtnSmall}>Installer</button>
        </div>
      </div>

      {/* GRILLE DES CATÉGORIES (Comme tes screenshots) */}
      <h4 style={s.sectionTitle}>Parcourir par genre</h4>
      <div style={s.categoryGrid}>
        {CATEGORIES.map(cat => (
          <div key={cat.n} style={s.catTile}>
            <span>{cat.n}</span>
            <span style={{fontSize:'20px'}}>{cat.i}</span>
          </div>
        ))}
      </div>

      {/* LISTE DES APPS DYNAMIQUES */}
      <h4 style={s.sectionTitle}>Recommandations</h4>
      <div style={s.appList}>
        {apps.map(app => (
          <div key={app.id} style={s.appRow}>
            <div style={s.appIcon}>{app.icon}</div>
            <div style={{flex:1, marginLeft:'12px'}}>
              <div style={s.appName}>{app.name}</div>
              <div style={s.appMeta}>{app.category} • {app.rating} ⭐</div>
            </div>
            <button 
              onClick={() => handleDownload(app)}
              style={app.isInstalled ? s.updateBtn : s.installBtn}
            >
              {app.isInstalled ? 'Mettre à jour' : 'Installer'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  container: { backgroundColor: '#050505', minHeight: '100vh', color: 'white', padding: '15px' },
  searchBar: { backgroundColor: '#1f1f1f', padding: '12px', borderRadius: '25px', color: '#999', fontSize: '14px', marginBottom: '15px' },
  navTabs: { display: 'flex', gap: '20px', borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '20px' },
  tabActive: { color: '#a855f7', borderBottom: '2px solid #a855f7', paddingBottom: '10px', fontSize: '13px' },
  tab: { color: '#888', fontSize: '13px' },
  heroCard: { height: '160px', borderRadius: '15px', background: 'linear-gradient(45deg, #2c1a4a, #a855f7)', position: 'relative', marginBottom: '25px', display: 'flex', alignItems: 'flex-end', padding: '15px' },
  heroText: { width: '100%' },
  installBtnSmall: { backgroundColor: 'white', color: 'black', border: 'none', padding: '5px 15px', borderRadius: '15px', marginTop: '10px', fontWeight: 'bold' },
  sectionTitle: { fontSize: '15px', marginBottom: '15px', color: '#ccc' },
  categoryGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '30px' },
  catTile: { backgroundColor: '#111', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' },
  appRow: { display: 'flex', alignItems: 'center', marginBottom: '20px' },
  appIcon: { width: '50px', height: '50px', backgroundColor: '#1f1f1f', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' },
  appName: { fontSize: '14px', fontWeight: 'bold' },
  appMeta: { fontSize: '11px', color: '#777' },
  installBtn: { backgroundColor: '#a855f7', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '18px', fontSize: '12px', fontWeight: 'bold' },
  updateBtn: { backgroundColor: 'transparent', color: '#a855f7', border: '1px solid #a855f7', padding: '6px 16px', borderRadius: '18px', fontSize: '12px' }
};
