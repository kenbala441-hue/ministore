import React from 'react';
import { ArrowLeft, Home, MessageSquare, User, Settings } from 'lucide-react';

export default function MainLayout({ children, currentTitle, onBack, showNavbar = true }) {
  return (
    <div style={styles.container}>
      {/* HEADER UNIFIÉ (Avec bouton retour intelligent) */}
      <header style={styles.header}>
        {onBack ? (
          <ArrowLeft onClick={onBack} style={styles.backIcon} size={24} />
        ) : (
          <div style={{ width: 24 }} /> /* Espace vide pour l'équilibre */
        )}
        <h1 style={styles.title}>{currentTitle || "ComicCrafte"}</h1>
        <div style={{ width: 24 }} />
      </header>

      {/* ZONE DE CONTENU (L'écran actuel) */}
      <main style={styles.content}>
        {children}
      </main>

      {/* NAVBAR DU BAS (Fixe) */}
      {showNavbar && (
        <nav style={styles.navbar}>
          <div style={styles.navItem}><Home size={22} /><span>Home</span></div>
          <div style={styles.navItem}><MessageSquare size={22} /><span>Chat</span></div>
          <div style={styles.navItem}><User size={22} /><span>Profil</span></div>
          <div style={styles.navItem}><Settings size={22} /><span>Réglages</span></div>
        </nav>
      )}
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100vh', background: '#000' },
  header: { 
    height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 15px', background: '#0a0a0a', borderBottom: '1px solid #222', color: '#00f5d4' 
  },
  title: { fontSize: '18px', fontWeight: 'bold', margin: 0 },
  backIcon: { cursor: 'pointer', color: '#fff' },
  content: { flex: 1, overflowY: 'auto' },
  navbar: { 
    height: '65px', display: 'flex', justifyContent: 'space-around', alignItems: 'center',
    background: '#0a0a0a', borderTop: '1px solid #222', paddingBottom: '5px' 
  },
  navItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '10px', color: '#888' }
};
