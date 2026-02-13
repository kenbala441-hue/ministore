import React, { useState } from 'react';

export default function Navbar({ setView }) {
  const [showMenu, setShowMenu] = useState(false);

  const go = (view) => {
    setShowMenu(false); // 🔒 ferme toujours le menu
    setView(view);
  };

  return (
    <div style={s.wrapper}>
      {showMenu && (
        <div style={s.floatingMenu}>
          <div style={s.menuItem} onClick={() => go('messaging')}>
            💬 Messages
          </div>
          <div style={s.menuItem}>
            👥 Contacts
          </div>
          <div style={s.menuItem}>
            ✍️ Add Story
          </div>
        </div>
      )}

      <nav style={s.navBar}>
        <div style={s.sideGroup}>
          <button onClick={() => go('home')} style={s.iconBtn}>
            🏠<br /><span style={s.text}>Accueil</span>
          </button>

          <button onClick={() => go('news')} style={s.iconBtn}>
            🎡<br /><span style={s.text}>News</span>
          </button>
        </div>

        {/* ⚡ BOUTON CENTRAL */}
        <div
          style={s.centerBtnWrapper}
          onClick={() => setShowMenu((v) => !v)}
        >
          <div style={s.glow}></div>
          <div style={s.boltCircle}>⚡</div>
        </div>

        <div style={s.sideGroup}>
          <button onClick={() => go('myseries')} style={s.iconBtn}>
            📚<br /><span style={s.text}>Mes Séries</span>
          </button>

          <button onClick={() => go('profile')} style={s.iconBtn}>
            👤<br /><span style={s.text}>Profil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

const s = {
  wrapper: {
    position: 'fixed',
    bottom: '20px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1000,
  },
  floatingMenu: {
    backgroundColor: 'rgba(26,26,46,0.95)',
    border: '1px solid #a855f7',
    borderRadius: '15px',
    padding: '10px',
    marginBottom: '10px',
    width: '160px',
    boxShadow: '0 0 20px rgba(168,85,247,0.4)',
  },
  menuItem: {
    color: '#fff',
    padding: '10px',
    fontSize: '14px',
    borderBottom: '1px solid #333',
    cursor: 'pointer',
  },
  navBar: {
    display: 'flex',
    backgroundColor: 'rgba(15,15,20,0.95)',
    border: '1px solid #a855f7',
    borderRadius: '25px',
    padding: '10px 20px',
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 0 20px rgba(168,85,247,0.35)',
  },
  sideGroup: { display: 'flex', gap: '20px' },
  iconBtn: {
    background: 'none',
    border: 'none',
    color: '#bbb',
    textAlign: 'center',
    cursor: 'pointer',
  },
  text: { fontSize: '10px', marginTop: '4px' },
  centerBtnWrapper: {
    position: 'relative',
    top: '-15px',
    cursor: 'pointer',
  },
  boltCircle: {
    width: '60px',
    height: '60px',
    backgroundColor: '#0f0f15',
    border: '3px solid #a855f7',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#a855f7',
    fontSize: '24px',
    zIndex: 2,
  },
  glow: {
    position: 'absolute',
    width: '70px',
    height: '70px',
    backgroundColor: '#a855f7',
    borderRadius: '50%',
    filter: 'blur(18px)',
    opacity: 0.6,
    top: '-5px',
    left: '-5px',
  },
};