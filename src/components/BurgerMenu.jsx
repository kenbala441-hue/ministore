import React, { useState } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function BurgerMenu({ isOpen, close, user, setView, currentView }) {
  const [neon, setNeon] = useState(true);

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

  const activeStyle = (page) => ({
    background: currentView === page
      ? (neon ? "linear-gradient(90deg,#a855f7,#00f5d4)" : "#222")
      : "transparent",
    boxShadow: currentView === page && neon
      ? "0 0 10px rgba(168,85,247,0.5)"
      : "none",
    border: currentView === page
      ? "1px solid #a855f7"
      : "1px solid #111"
  });

  return (
    <>
      {isOpen && <div style={s.overlay} onClick={close}></div>}

      <div style={{
        ...s.menu,
        left: isOpen ? '0' : '-100%',
        background: neon
          ? "radial-gradient(circle at top, #0a1128, #000)"
          : "#0a0a0a"
      }}>

        {/* HEADER COLORÉ */}
        <div style={{
          ...s.profileHeader,
          background: neon
            ? "linear-gradient(90deg,#a855f7,#00f5d4)"
            : "#111"
        }}>
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

        {/* TOGGLE MODE */}
        <div style={{ padding: "10px 20px" }}>
          <button
            onClick={() => setNeon(!neon)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Mode : {neon ? "Néon" : "Normal"}
          </button>
        </div>

        <div style={s.links}>

          {/* NAV */}
          <div style={{ ...s.linkItem, ...activeStyle('home') }} onClick={() => go('home')}>
            🏠 <span style={s.linkText}>Accueil</span>
          </div>

          <div
            style={{ ...s.linkItem, ...activeStyle('profile') }}
            onClick={() => requireAuth(() => go('profile'))}
          >
            👤 <span style={s.linkText}>Mon Profil</span>
          </div>

          <div style={{ ...s.linkItem, ...activeStyle('news') }} onClick={() => go('news')}>
            🆕 <span style={s.linkText}>Nouveautés</span>
          </div>

          <div style={s.divider}></div>

          {/* MARKET */}
          <div
            style={{ ...s.linkItem, ...activeStyle('ink_market') }}
            onClick={() => requireAuth(() => go('ink_market'))}
          >
            💎 <span style={s.linkText}>Ink Market</span>
          </div>

          <div
            style={{ ...s.linkItem, ...activeStyle('wallet_history') }}
            onClick={() => requireAuth(() => go('wallet_history'))}
          >
            📜 <span style={s.linkText}>Historique des transactions</span>
          </div>

          <div style={s.divider}></div>

          {/* AUTHOR */}
          <div
            style={{ ...s.linkItem, ...activeStyle('author_intro') }}
            onClick={() => requireAuth(() => go('author_intro'))}
          >
            ✍️ <span style={s.linkText}>Devenir Auteur</span>
          </div>

          <div style={{ ...s.linkItem, ...activeStyle('store') }} onClick={() => go('store')}>
            🚀 <span style={s.linkText}>Mises à jour</span>
          </div>

          <div style={s.divider}></div>

          {/* ADMIN */}
          <div style={{ ...s.linkItem, ...activeStyle('admin_login') }} onClick={() => go('admin_login')}>
            🛡️ <span style={s.linkText}>Administration</span>
          </div>

          <div style={s.divider}></div>

          {/* SUPPORT */}
          <div style={{ ...s.linkItem, ...activeStyle('help') }} onClick={() => go('help')}>
            ❓ <span style={s.linkText}>Centre d'aide</span>
          </div>

          <div style={{ ...s.linkItem, ...activeStyle('about') }} onClick={() => go('about')}>
            ℹ️ <span style={s.linkText}>À propos</span>
          </div>

          <div style={s.divider}></div>

          {/* SECURITY */}
          {user && (
            <div
              style={{ ...s.linkItem, ...activeStyle('security_center') }}
              onClick={() => go('security_center')}
            >
              🔐 <span style={s.linkText}>Centre de Sécurité</span>
            </div>
          )}

          {/* LOGOUT */}
          {user && (
            <button style={s.logoutBtn} onClick={handleSignOut}>
              🚪 Déconnexion
            </button>
          )}
        </div>

        <div style={s.footer}>
          ComicCraft v1.1.0
        </div>
      </div>
    </>
  );
}

/* =========================
   STYLES
========================= */

const s = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 1000,
    backdropFilter: 'blur(4px)'
  },

  menu: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '85%',
    maxWidth: '340px',
    height: '100dvh',
    zIndex: 1001,
    transition: '0.4s',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },

  profileHeader: {
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative'
  },

  avatar: {
    width: '55px',
    height: '55px',
    borderRadius: '50%',
    background: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },

  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },

  userInfo: {
    marginLeft: '15px'
  },

  userName: {
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#fff'
  },

  userEmail: {
    fontSize: '10px',
    color: '#eee'
  },

  closeBtn: {
    position: 'absolute',
    right: '15px',
    top: '15px',
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '20px',
    cursor: 'pointer'
  },

  links: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    paddingBottom: '120px'
  },

  linkItem: {
    padding: '12px',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: '0.2s'
  },

  linkText: {
    marginLeft: '15px',
    fontSize: '14px',
    color: '#fff'
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
    color: '#666',
    borderTop: '1px solid #111'
  }
};