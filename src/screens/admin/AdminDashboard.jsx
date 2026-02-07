import React, { useState } from 'react';

export default function AdminDashboard({ setView }) {
  const stats = { users: 1250, authors: 45, reports: 3 };

  const [users, setUsers] = useState([
    { id: 1, name: "DarkSasuke99", status: "ACTIF", role: "Auteur" },
    { id: 2, name: "LeTroll2024", status: "ACTIF", role: "Lecteur" },
  ]);

  const banUser = (id) => {
    setUsers(prev =>
      prev.map(u => u.id === id ? { ...u, status: "BANNI" } : u)
    );
  };

  return (
    <div style={s.container}>
      <header style={s.header}>
        <h2 style={s.title}>
          PANEL ADMIN <span style={s.live}>● LIVE</span>
        </h2>
        <button style={s.exitBtn} onClick={() => setView('home')}>
          Quitter
        </button>
      </header>

      {/* STATS */}
      <div style={s.statsGrid}>
        <div style={s.statCard}>
          <h3>{stats.users}</h3>
          <p>Membres</p>
        </div>

        <div style={s.statCard}>
          <h3>{stats.authors}</h3>
          <p>Auteurs</p>
        </div>

        <div style={{ ...s.statCard, border: '1px solid red' }}>
          <h3 style={{ color: 'red' }}>{stats.reports}</h3>
          <p>Signalements</p>
        </div>
      </div>

      {/* UTILISATEURS */}
      <h3 style={s.sectionTitle}>Modération & Utilisateurs</h3>

      <div style={s.userList}>
        {users.map(user => (
          <div key={user.id} style={s.userRow}>
            <div>
              <div style={s.userName}>
                {user.name} ({user.role})
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: user.status === "BANNI" ? 'red' : 'lime'
                }}
              >
                {user.status}
              </div>
            </div>

            {user.status !== "BANNI" && (
              <button style={s.banBtn} onClick={() => banUser(user.id)}>
                BANNIR
              </button>
            )}
          </div>
        ))}
      </div>

      <footer style={s.footer}>
        <p>
          Code Admin Actif :
          <span style={{ color: '#a855f7' }}> COMIC-CRAFT-CONFIDENTIAL</span>
        </p>
      </footer>
    </div>
  );
}

const s = {
  container: { background: '#000', minHeight: '100vh', padding: 15, color: '#fff' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 18, color: '#ff4444' },
  live: { fontSize: 10, color: '#00ff00', marginLeft: 8 },
  exitBtn: { background: '#222', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 25 },
  statCard: { background: '#111', padding: 15, borderRadius: 10, textAlign: 'center', border: '1px solid #333' },
  sectionTitle: { fontSize: 14, color: '#888', marginBottom: 10 },
  userList: { background: '#0a0a0a', borderRadius: 10 },
  userRow: { display: 'flex', justifyContent: 'space-between', padding: 15, borderBottom: '1px solid #1a1a1a' }, // ✅ ici padding = 15
  userName: { fontSize: 13, fontWeight: 'bold' },
  banBtn: { border: '1px solid red', background: 'transparent', color: 'red', padding: '4px 10px', borderRadius: 5 },
  footer: { marginTop: 30, fontSize: 9, textAlign: 'center', opacity: 0.5 }
};