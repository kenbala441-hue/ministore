import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function BurgerMenu({ isOpen, close, user, setView }) {

  const handleSignOut = async () => {
    const confirm = window.confirm("Se déconnecter de ComicCraft ?");
    if (!confirm) return;

    try {
      await signOut(auth);
      close();
      setView("home");
    } catch (err) {
      console.error("Erreur déconnexion:", err);
      alert("Erreur lors de la déconnexion.");
    }
  };

  const requireAuth = (callback) => {
    if (!user) {
      alert("Vous devez être connecté pour accéder à cette section.");
      setView("login");
      close();
      return false;
    }
    callback();
    close();
    return true;
  };

  const go = (page) => {
    setView(page);
    close();
  };

  return (
    <>
      {isOpen && <div style={s.overlay} onClick={close}></div>}

      <div style={{ ...s.menu, left: isOpen ? '0' : '-100%' }}>
        
        <div style={s.profileHeader}>
          <div style={s.avatar}>
            {user?.photoURL 
              ? <img src={user.photoURL} style={s.img} alt="Profil" /> 
              : "👤"}
          </div>

          <div style={s.userInfo}>
            <div style={s.userName}>
              {user?.displayName || "Utilisateur"}
            </div>
            <div style={s.userEmail}>
              {user?.email || "Non connecté"}
            </div>
          </div>

          <button style={s.closeBtn} onClick={close}>✕</button>
        </div>

        <div style={s.links}>
          
          {/* Navigation principale */}
          <div style={s.linkItem} onClick={() => go('home')}>
            🏠 <span style={s.linkText}>Accueil</span>
          </div>

          <div
            style={s.linkItem}
            onClick={() => requireAuth(() => setView('profile'))}
          >
            👤 <span style={s.linkText}>Mon Profil</span>
          </div>

          <div style={s.linkItem} onClick={() => go('news')}>
            🆕 <span style={s.linkText}>Nouveautés</span>
          </div>

          <div style={s.divider}></div>

          {/* Ink Market ajouté (VERSION PRO) */}
          <div
            style={s.linkItem}
            onClick={() => requireAuth(() => setView('ink_market'))}
          >
            💎 <span style={s.linkText}>Ink Market</span>
          </div>

          <div
            style={s.linkItem}
            onClick={() => requireAuth(() => setView('wallet_history'))}
          >
            📜 <span style={s.linkText}>Historique des transactions</span>
          </div>

          <div style={s.divider}></div>

          {/* Auteur / Store */}
          <div
            style={s.linkItem}
            onClick={() => requireAuth(() => setView('author_intro'))}
          >
            ✍️ <span style={s.linkText}>Devenir Auteur</span>
          </div>

          <div style={s.linkItem} onClick={() => go('store')}>
            🚀 <span style={s.linkText}>Mises à jour</span>
          </div>

          <div style={s.divider}></div>

          {/* Admin */}
          <div style={s.linkItem} onClick={() => go('admin_login')}>
            🛡️ <span style={s.linkText}>Administration</span>
          </div>

          {/* Sécurité / Compte */}
          {user && (
            <div
              style={s.linkItem}
              onClick={() => setView('security_center')}
            >
              🔐 <span style={s.linkText}>Centre de Sécurité</span>
            </div>
          )}

          {/* Déconnexion */}
          {user && (
            <button style={s.logoutBtn} onClick={handleSignOut}>
              🚪 Déconnexion
            </button>
          )}
        </div>

        <div style={s.footer}>
          ComicCraft v1.1.0 - Secure Finance Build
        </div>
      </div>
    </>
  );
}

const s = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 1000,
    backdropFilter: 'blur(3px)'
  },

  menu: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '85%',
    maxWidth: '340px',
    height: '100dvh', // corrige Android moderne
    backgroundColor: '#0a0a0a',
    zIndex: 1001,
    transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRight: '1px solid #a855f7',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '5px 0 25px rgba(168,85,247,0.25)',
    overflow: 'hidden'
  },

  profileHeader: {
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    borderBottom: '1px solid #111',
    flexShrink: 0
  },

  avatar: {
    width: '55px',
    height: '55px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#a855f7,#00f5d4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    overflow: 'hidden',
    flexShrink: 0
  },

  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },

  userInfo: {
    marginLeft: '15px',
    overflow: 'hidden'
  },

  userName: {
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },

  userEmail: {
    fontSize: '10px',
    color: '#666',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },

  closeBtn: {
    position: 'absolute',
    right: '15px',
    top: '15px',
    background: 'none',
    border: 'none',
    color: '#a855f7',
    fontSize: '20px',
    cursor: 'pointer'
  },

  links: {
    flex: 1,
    overflowY: 'auto', // 🔥 active le scroll
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    paddingBottom: '140px' // espace pour éviter blocage en bas
  },

  linkItem: {
    padding: '12px',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: '0.2s',
    backgroundColor: 'transparent',
    border: '1px solid #111'
  },

  linkText: {
    marginLeft: '15px',
    fontSize: '14px',
    color: '#ccc'
  },

  divider: {
    height: '1px',
    backgroundColor: '#1a1a1a',
    margin: '12px 0'
  },

  logoutBtn: {
    marginTop: '20px',
    padding: '12px',
    backgroundColor: '#ff444422',
    border: '1px solid #ff4444',
    color: '#ff4444',
    borderRadius: '10px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: '12px',
    textAlign: 'center',
    fontSize: '10px',
    color: '#333',
    backgroundColor: '#0a0a0a',
    borderTop: '1px solid #111'
  }
};