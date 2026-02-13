import React from "react";

export default function AdminLayout({ children, setView }) {
  return (
    <div style={s.wrapper}>
      {/* SIDEBAR */}
      <aside style={s.sidebar}>
        <h2 style={s.logo}>COMICCRAFTE</h2>
        <nav style={s.nav}>
          <Section title="Dashboard">
            <NavItem label="Vue générale" onClick={() => setView("admin_overview")} />
            <NavItem label="Statistiques" onClick={() => setView("admin_stats")} />
            <NavItem label="Activité" onClick={() => setView("admin_activity")} />
          </Section>

          <Section title="Utilisateurs">
            <NavItem label="Liste des membres" onClick={() => setView("admin_users")} />
            <NavItem label="Rôles" onClick={() => setView("admin_roles")} />
            <NavItem label="Bannissements" onClick={() => setView("admin_bans")} />
          </Section>

          <Section title="Contenu">
            <NavItem label="Bibliothèque" onClick={() => setView("admin_library")} />
            <NavItem label="Chapitres" onClick={() => setView("admin_chapters")} />
            <NavItem label="Planification" onClick={() => setView("admin_planner")} />
            <NavItem label="Modération" onClick={() => setView("admin_moderation")} />
          </Section>

          <Section title="Sécurité">
            <NavItem label="Logs" onClick={() => setView("admin_audit")} />
            <NavItem label="Sessions" onClick={() => setView("admin_sessions")} />
            <NavItem label="IP Whitelist" onClick={() => setView("admin_ip")} />
          </Section>

          <Section title="Paramètres">
            <NavItem label="Application" onClick={() => setView("admin_settings")} />
            <NavItem label="Maintenance" onClick={() => setView("admin_maintenance")} />
          </Section>
        </nav>
      </aside>

      {/* MAIN */}
      <main style={s.main}>
        <header style={s.topbar}>
          <span>Admin Panel</span>
          <button style={s.exit} onClick={() => setView("home")}>
            Quitter
          </button>
        </header>

        <section style={s.content}>{children}</section>
      </main>
    </div>
  );
}

/* ---------- SUB COMPONENTS ---------- */

function Section({ title, children }) {
  return (
    <div style={s.section}>
      <p style={s.sectionTitle}>{title}</p>
      {children}
    </div>
  );
}

function NavItem({ label, onClick }) {
  return (
    <button style={s.navItem} onClick={onClick}>
      {label}
    </button>
  );
}

/* ---------- STYLES ---------- */

const s = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#050505",
    color: "#0ff",
    fontFamily: "Arial, sans-serif",
  },
  sidebar: {
    width: 220,
    backgroundColor: "#0b0b0b",
    borderRight: "2px solid #0ff",
    padding: 8,
    overflowY: "auto",
  },
  logo: {
    color: "#0ff",
    letterSpacing: 1,
    marginBottom: 12,
    fontSize: 16,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  sectionTitle: {
    fontSize: 9,
    color: "#0f0",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  navItem: {
    background: "none",
    border: "none",
    color: "#0ff",
    textAlign: "left",
    padding: "2px 0",
    fontSize: 11,
    cursor: "pointer",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(120deg, #000, #001f3f)",
    overflow: "hidden",
  },
  topbar: {
    height: 45,
    borderBottom: "1px solid #1f1f1f",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 8px",
    fontSize: 12,
    color: "#0f0",
  },
  exit: {
    background: "none",
    border: "1px solid #0ff",
    color: "#0ff",
    padding: "2px 8px",
    borderRadius: 3,
    cursor: "pointer",
    fontSize: 11,
  },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: 8,
  },
};