import React, { useState } from "react";

export default function Overview() {
  const stats = {
    users: 1250,
    active: 1020,
    inactive: 230,
    reports: 3,
    lastPurchases: 12,
  };

  const [users] = useState([
    { id: 1, name: "DarkSasuke99", status: "ACTIF", role: "Auteur" },
    { id: 2, name: "LeTroll2024", status: "INACTIF", role: "Lecteur" },
  ]);

  if (!stats || !users) return <div style={s.wrapper}>Chargement...</div>;

  return (
    <div style={s.wrapper}>
      <h2 style={s.title}>Vue Générale</h2>

      <div style={s.statsGrid}>
        <div style={s.card}>
          <h3>{stats.users ?? 0}</h3>
          <p>Total Membres</p>
        </div>
        <div style={s.card}>
          <h3>{stats.active ?? 0}</h3>
          <p>Actifs</p>
        </div>
        <div style={s.card}>
          <h3>{stats.inactive ?? 0}</h3>
          <p>Inactifs</p>
        </div>
        <div style={{ ...s.card, border: "1px solid red" }}>
          <h3 style={{ color: "red" }}>{stats.reports ?? 0}</h3>
          <p>Signalements</p>
        </div>
        <div style={s.card}>
          <h3>{stats.lastPurchases ?? 0}</h3>
          <p>Derniers Achats</p>
        </div>
      </div>

      <h3 style={s.subTitle}>Utilisateurs récents</h3>
      <div style={s.userList}>
        {users.length ? (
          users.map((u) => (
            <div key={u.id} style={s.userRow}>
              <span>{u.name || "N/A"}</span>
              <span>{u.role || "N/A"}</span>
              <span style={{ color: u.status === "ACTIF" ? "#0f0" : "#f00" }}>
                {u.status || "INCONNU"}
              </span>
            </div>
          ))
        ) : (
          <div style={{ color: "#0ff", padding: 6 }}>
            Aucun utilisateur récent
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  wrapper: {
    minHeight: "100%",
    padding: 8,
    color: "#0ff",
    background: "linear-gradient(135deg, #000 0%, #001f3f 100%)",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    marginBottom: 8,
    fontSize: 16,
    color: "#0ff",
  },
  subTitle: {
    marginTop: 8,
    marginBottom: 4,
    fontSize: 13,
    color: "#0ff",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(70px, 1fr))",
    gap: 6,
    marginBottom: 8,
  },
  card: {
    background: "rgba(0,255,255,0.1)",
    padding: 6,
    borderRadius: 6,
    textAlign: "center",
    fontSize: 11,
    color: "#0ff",
    boxShadow: "0 0 6px #0ff",
  },
  userList: {
    background: "rgba(0,0,0,0.3)",
    borderRadius: 6,
    padding: 6,
    maxHeight: 140,
    overflowY: "auto",
    boxShadow: "0 0 8px #0ff inset",
  },
  userRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr auto",
    gap: 6,
    padding: "3px 0",
    borderBottom: "1px solid #0ff33",
    fontSize: 10,
  },
};