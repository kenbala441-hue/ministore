import React, { useState } from 'react';

export default function Profile({ setView, userStatus = 'user' }) {
  const [darkMode, setDarkMode] = useState(true);
  const [username, setUsername] = useState('Ken Mikael');
  const [editing, setEditing] = useState(false);

  const roleColor =
    userStatus === 'admin'
      ? '#ff4dff'
      : userStatus === 'author'
      ? '#00f5ff'
      : '#a855f7';

  return (
    <div
      style={{
        ...s.container,
        backgroundColor: darkMode ? '#050508' : '#f4f4f8',
        color: darkMode ? '#fff' : '#111',
      }}
    >
      {/* HEADER */}
      <div style={s.header}>
        <div style={s.avatarGlow}></div>
        <div style={s.avatar}>👤</div>

        {editing ? (
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={s.input}
          />
        ) : (
          <h2>{username}</h2>
        )}

        <span style={{ ...s.role, color: roleColor }}>
          {userStatus.toUpperCase()}
        </span>
      </div>

      {/* ACTIONS */}
      <div style={s.actions}>
        <button style={s.btn} onClick={() => setEditing(!editing)}>
          ✏️ Modifier le nom
        </button>

        <button style={s.btn} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '🌙 Dark mode' : '☀️ Light mode'}
        </button>
      </div>

      {/* STATS */}
      <div style={s.stats}>
        <div style={s.statBox}>
          <span style={s.statNumber}>2.3K</span>
          <span style={s.statLabel}>Abonnés</span>
        </div>
        <div style={s.statBox}>
          <span style={s.statNumber}>180</span>
          <span style={s.statLabel}>Abonnements</span>
        </div>
        <div style={s.statBox}>
          <span style={s.statNumber}>12</span>
          <span style={s.statLabel}>Séries</span>
        </div>
      </div>

      {/* MENU */}
      <div style={s.menu}>
        <div style={s.menuItem} onClick={() => setView('profile_theme')}>
          🎨 Thème & Apparence
        </div>

        <div style={s.menuItem} onClick={() => setView('profile_security')}>
          🔐 Sécurité & 2FA
        </div>

        {userStatus === 'admin' && (
          <div
            style={{ ...s.menuItem, color: '#ff4dff' }}
            onClick={() => setView('admin')}
          >
            🛠️ Admin Panel
          </div>
        )}

        <div style={s.menuItem} onClick={() => setView('home')}>
          ← Retour accueil
        </div>
      </div>
    </div>
  );
}