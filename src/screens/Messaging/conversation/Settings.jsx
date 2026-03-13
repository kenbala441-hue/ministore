import React from 'react';
import { ArrowLeft, User, Shield, Monitor, Clock, LogOut, Camera } from 'lucide-react';

export default function Settings({ currentUser, onBack }) {
  const sections = [
    { id: 'profile', icon: <User />, title: 'Compte', sub: "Photo, nom et bio" },
    { id: 'privacy', icon: <Shield />, title: 'Confidentialité', sub: "Messages éphémères, blocage" },
    { id: 'devices', icon: <Monitor />, title: 'Appareils connectés', sub: "Gérer vos sessions" },
    { id: 'duration', icon: <Clock />, title: 'Durée des messages', sub: "Auto-suppression" },
  ];

  return (
    <div style={st.container}>
      {/* HEADER AVEC BOUTON RETOUR */}
      <div style={st.header}>
        <ArrowLeft onClick={onBack} style={{cursor: 'pointer'}} />
        <span style={{marginLeft: '15px', fontWeight: 'bold'}}>Paramètres</span>
      </div>

      {/* PROFIL CARD */}
      <div style={st.profileCard}>
        <div style={st.avatarWrapper}>
          <img 
            src={currentUser?.photoURL || "https://via.placeholder.com/150"} 
            alt="Profil" 
            style={st.avatar}
          />
          <div style={st.cameraIcon}><Camera size={14} /></div>
        </div>
        <div style={{marginLeft: '15px'}}>
          <h2 style={st.userName}>{currentUser?.displayName || "Utilisateur Pro"}</h2>
          <p style={st.userStatus}>Disponible</p>
        </div>
      </div>

      {/* LISTE DES OPTIONS */}
      <div style={st.list}>
        {sections.map(item => (
          <div key={item.id} style={st.item}>
            <div style={st.itemIcon}>{item.icon}</div>
            <div style={st.itemText}>
              <div style={st.itemTitle}>{item.title}</div>
              <div style={st.itemSub}>{item.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={st.logoutItem}>
        <LogOut size={20} color="#ff4d4d" />
        <span style={{marginLeft: '15px', color: '#ff4d4d'}}>Déconnexion</span>
      </div>
    </div>
  );
}

const st = {
  container: { background: '#000', height: '100%', color: '#fff', padding: '10px' },
  header: { display: 'flex', alignItems: 'center', padding: '15px', borderBottom: '1px solid #222', fontSize: '18px' },
  profileCard: { display: 'flex', alignItems: 'center', padding: '20px', background: '#0a0a0a', margin: '10px 0', borderRadius: '15px' },
  avatarWrapper: { position: 'relative' },
  avatar: { width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00f5d4' },
  cameraIcon: { position: 'absolute', bottom: 0, right: 0, background: '#00f5d4', borderRadius: '50%', padding: '4px', color: '#000' },
  userName: { margin: 0, fontSize: '18px' },
  userStatus: { margin: 0, fontSize: '14px', color: '#888' },
  list: { marginTop: '10px' },
  item: { display: 'flex', alignItems: 'center', padding: '15px', borderBottom: '1px solid #111', cursor: 'pointer' },
  itemIcon: { color: '#00f5d4', opacity: 0.8 },
  itemText: { marginLeft: '20px' },
  itemTitle: { fontSize: '16px' },
  itemSub: { fontSize: '12px', color: '#666' },
  logoutItem: { display: 'flex', alignItems: 'center', padding: '20px', marginTop: '20px', borderTop: '1px solid #222', cursor: 'pointer' }
};
