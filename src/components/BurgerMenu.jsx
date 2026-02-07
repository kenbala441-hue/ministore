import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function BurgerMenu({ isOpen, close, user, setView }) {
  
  const handleSignOut = () => {
    if(window.confirm("Se déconnecter de ComicCraft ?")) {
      signOut(auth);
    }
  };

  return (
    <>
      {/* Overlay noir transparent qui ferme le menu quand on clique dessus */}
      {isOpen && <div style={s.overlay} onClick={close}></div>}

      {/* Le Menu Latéral */}
      <div style={{...s.menu, left: isOpen ? '0' : '-100%'}}>
        
        {/* En-tête Profil */}
        <div style={s.profileHeader}>
          <div style={s.avatar}>
            {user?.photoURL ? <img src={user.photoURL} style={s.img} alt="P" /> : "👤"}
          </div>
          <div style={s.userInfo}>
            <div style={s.userName}>{user?.displayName || "Utilisateur"}</div>
            <div style={s.userEmail}>{user?.email}</div>
          </div>
          <button style={s.closeBtn} onClick={close}>✕</button>
        </div>

        {/* Liste des Options */}
        <div style={s.links}>
          <div style={s.linkItem} onClick={() => {setView('home'); close();}}>
            🏠 <span style={s.linkText}>Accueil</span>
          </div>
          <div style={s.linkItem} onClick={() => {setView('profile'); close();}}>
            👤 <span style={s.linkText}>Mon Profil</span>
          </div>
          <div style={s.linkItem} onClick={() => {setView('news'); close();}}>
            🆕 <span style={s.linkText}>Nouveautés</span>
          </div>
          
          <div style={s.divider}></div>

          <div style={s.linkItem} onClick={() => {setView('publisher'); close();}}>
            ✍️ <span style={s.linkText}>Devenir Auteur</span>
          </div>
          <div style={s.linkItem} onClick={() => {setView('store'); close();}}>
            🚀 <span style={s.linkText}>Mises à jour</span>
          </div>

          <div style={s.divider}></div>

          <div style={s.linkItem} onClick={() => setView('admin_login')}>
            🛡️ <span style={s.linkText}>Administration</span>
          </div>
          
          <button style={s.logoutBtn} onClick={handleSignOut}>
            🚪 Déconnexion
          </button>
        </div>

        <div style={s.footer}>
          ComicCraft v1.0.5 - Bêta
        </div>
      </div>
    </>
  );
}

const s = {
  overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, backdropFilter: 'blur(3px)' },
  menu: { position: 'fixed', top: 0, width: '80%', maxWidth: '300px', height: '100%', backgroundColor: '#0a0a0a', zIndex: 1001, transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)', borderRight: '1px solid #a855f7', padding: '20px', display: 'flex', flexDirection: 'column' },
  profileHeader: { display: 'flex', alignItems: 'center', marginBottom: '30px', position: 'relative', borderBottom: '1px solid #111', paddingBottom: '20px' },
  avatar: { width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#a855f7', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  userInfo: { marginLeft: '15px' },
  userName: { fontWeight: 'bold', fontSize: '14px', color: '#fff' },
  userEmail: { fontSize: '10px', color: '#555' },
  closeBtn: { position: 'absolute', right: 0, top: 0, background: 'none', border: 'none', color: '#a855f7', fontSize: '20px' },
  links: { flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' },
  linkItem: { padding: '12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: '0.2s', backgroundColor: 'transparent' },
  linkText: { marginLeft: '15px', fontSize: '14px', color: '#ccc' },
  divider: { height: '1px', backgroundColor: '#1a1a1a', margin: '10px 0' },
  logoutBtn: { marginTop: 'auto', padding: '12px', backgroundColor: '#ff444422', border: '1px solid #ff4444', color: '#ff4444', borderRadius: '8px', fontWeight: 'bold' },
  footer: { textAlign: 'center', fontSize: '10px', color: '#333', marginTop: '20px' }
};
