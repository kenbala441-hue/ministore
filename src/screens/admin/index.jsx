import React, { useState } from 'react';
import AdminGuard from './AdminGuard';

// Import de tous les sous-composants (à créer dans ton dossier admin)
import AdminHome from './AdminHome'; 
import UserManager from './UserManager';
import ContentManager from './ContentManager';
import InkSystem from './InkSystem';

export default function AdminIndex() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <AdminGuard>
      {/* Une fois le garde passé, on affiche la structure complète */}
      <div style={layout.container}>
        
        {/* Menu Latéral Admin */}
        <aside style={layout.sidebar}>
          <h2 style={layout.logo}>CC <span style={{color:'#00fff2'}}>STUDIO</span></h2>
          <nav style={layout.nav}>
            <button onClick={() => setActiveTab('home')} style={activeTab === 'home' ? layout.activeBtn : layout.btn}>Tableau de bord</button>
            <button onClick={() => setActiveTab('users')} style={activeTab === 'users' ? layout.activeBtn : layout.btn}>Utilisateurs</button>
            <button onClick={() => setActiveTab('content')} style={activeTab === 'content' ? layout.activeBtn : layout.btn}>Gestion Contenu</button>
            <button onClick={() => setActiveTab('inks')} style={activeTab === 'inks' ? layout.activeBtn : layout.btn}>Système INK</button>
          </nav>
        </aside>

        {/* Zone de contenu dynamique */}
        <main style={layout.main}>
          {activeTab === 'home' && <AdminHome />}
          {activeTab === 'users' && <UserManager />}
          {activeTab === 'content' && <ContentManager />}
          {activeTab === 'inks' && <InkSystem />}
        </main>

      </div>
    </AdminGuard>
  );
}

const layout = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#0a0a0a', color: '#fff' },
  sidebar: { width: '250px', borderRight: '1px solid #222', padding: '20px', display: 'flex', flexDirection: 'column' },
  logo: { fontSize: '20px', fontWeight: '900', marginBottom: '40px', textAlign: 'center' },
  nav: { display: 'flex', flexDirection: 'column', gap: '10px' },
  btn: { padding: '12px', textAlign: 'left', background: 'none', border: 'none', color: '#888', cursor: 'pointer', borderRadius: '8px' },
  activeBtn: { padding: '12px', textAlign: 'left', background: 'rgba(0, 255, 242, 0.1)', border: 'none', color: '#00fff2', fontWeight: 'bold', borderRadius: '8px' },
  main: { flex: 1, overflowY: 'auto', padding: '30px' }
};
