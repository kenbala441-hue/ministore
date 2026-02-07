import React, { useState } from 'react';

export default function Messaging({ setView, userStatus }) {
  const [activeChat, setActiveChat] = useState(null);

  const chats = [
    { id: 1, name: "Admin_Comic", msg: "Votre certification VIP est active !", time: "10:30", badge: "🛡️", status: "Admin" },
    { id: 2, name: "Z-Art", msg: "On collabore sur le prochain chapitre ?", time: "Hier", badge: "💎", status: "VIP" },
    { id: 3, name: "SoloPlayer", msg: "Merci pour le cadeau de 50 ₵ !", time: "Lun", badge: "✨", status: "Premium" },
  ];

  return (
    <div style={s.container}>
      {/* HEADER MESSAGERIE */}
      <div style={s.header}>
        <button onClick={() => setView('home')} style={s.backBtn}>←</button>
        <h2 style={{fontSize: '18px'}}>Messagerie Sécurisée</h2>
        <div style={s.lockIcon}>🔒</div>
      </div>

      {/* FILTRE DE RECHERCHE */}
      <div style={s.searchBar}>
        <input type="text" placeholder="Rechercher un utilisateur..." style={s.input} />
      </div>

      {/* LISTE DES DISCUSSIONS */}
      <div style={s.chatList}>
        {chats.map(chat => (
          <div key={chat.id} style={s.chatItem} onClick={() => alert("Ouvrir chat avec " + chat.name)}>
            <div style={s.avatar}>
              {chat.name[0]}
              <div style={s.onlineDot}></div>
            </div>
            <div style={{flex: 1}}>
              <div style={s.nameRow}>
                <span style={s.name}>{chat.name} <span style={{fontSize:'10px'}}>{chat.badge}</span></span>
                <span style={s.time}>{chat.time}</span>
              </div>
              <div style={s.lastMsg}>{chat.msg}</div>
            </div>
          </div>
        ))}
      </div>

      {/* BOUTON NOUVEAU GROUPE (Réservé Premium/VIP) */}
      <button 
        style={s.groupBtn} 
        onClick={() => userStatus === 'standard' ? alert("Option réservée aux Premium !") : alert("Création de groupe...")}
      >
        ➕ Créer un groupe
      </button>

      {/* NOTICE DE SÉCURITÉ */}
      <div style={s.securityNotice}>
        🛡️ Chiffrement de bout en bout activé. <br/>
        Authentification 2FA requise pour les retraits de Craft-Ink.
      </div>
    </div>
  );
}

const s = {
  container: { backgroundColor: '#050505', minHeight: '100vh', color: '#fff' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #1a1a1a' },
  backBtn: { background: 'none', border: 'none', color: '#a855f7', fontSize: '20px' },
  lockIcon: { color: '#00f5d4', fontSize: '18px' },
  searchBar: { padding: '15px' },
  input: { width: '100%', padding: '12px', borderRadius: '25px', border: 'none', backgroundColor: '#111', color: '#fff', fontSize: '12px' },
  chatList: { padding: '0 10px' },
  chatItem: { display: 'flex', gap: '15px', padding: '15px', borderRadius: '12px', marginBottom: '5px', cursor: 'pointer', backgroundColor: '#0a0a0a' },
  avatar: { width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#1a1a1a', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', position: 'relative', border: '1px solid #333' },
  onlineDot: { width: '12px', height: '12px', backgroundColor: '#00f5d4', borderRadius: '50%', position: 'absolute', bottom: 0, right: 0, border: '2px solid #0a0a0a' },
  nameRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: '14px', fontWeight: 'bold' },
  time: { fontSize: '10px', color: '#444' },
  lastMsg: { fontSize: '12px', color: '#777', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  groupBtn: { position: 'fixed', bottom: '100px', right: '20px', backgroundColor: '#a855f7', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)' },
  securityNotice: { textAlign: 'center', padding: '20px', fontSize: '9px', color: '#333', marginTop: '20px' }
};
