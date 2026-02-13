// src/screens/admin/AdminDashboard.jsx
import React, { useState } from "react";
import AdminLayout from "./layout/AdminLayout.jsx"; // chemin correct
import Overview from "./dashboard/Overview.jsx";     // chemin correct

const ADMIN_CODES = [
  "ADM-9F4KX2P7M8QJZ1W6L0R5C3ADEV-SECURE-ACCESS-0001",
  "ADM-A8QZ5R6M9F7C4W0J3L1PDEV-SECURE-ACCESS-0002",
  "ADM-ZM4Q1P7L9R6F5W3A8J0CDEV-SECURE-ACCESS-0003",
  "ADM-7R9F0C4LQZ5W6P1A8MJDEV-SECURE-ACCESS-0004",
  "ADM-P6Z9W8Q5F1R7C4M0A3LJDEV-SECURE-ACCESS-0005",
  "ADM-1QZ6F3W9C5R8M7P0A4LJDEV-SECURE-ACCESS-0006",
  "ADM-W5F7PZ1Q4R8C6L9M0A3JDEV-SECURE-ACCESS-0007",
  "ADM-9M8ZP5R6F0WQ7C1A4L3JDEV-SECURE-ACCESS-0008",
  "ADM-Q0R6F1Z8W9P7C5M4A3LJDEV-SECURE-ACCESS-0009",
  "ADM-4FQ9Z5R7C1W6M8P0A3LJDEV-SECURE-ACCESS-0010",
];

export default function AdminDashboard({ setView }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleAccess = () => {
    if (ADMIN_CODES.includes(code.trim())) {
      setError("");
      setSuccess(true);

      setTimeout(() => {
        setView("admin"); // mène vers AdminLayout / Overview
      }, 2000);
    } else {
      setError("⛔ Code invalide. Accès refusé.");
    }
  };

  // ✅ Si accès validé, afficher directement le layout avec Overview
  if (success) {
    return <AdminLayout setView={setView}><Overview /></AdminLayout>;
  }

  return (
    <div style={s.container}>
      <h2 style={s.title}>🔐 ACCÈS ADMINISTRATEUR</h2>

      <p style={s.text}>
        Félicitations si vous êtes ici.  
        Pour continuer, vous devez prouver que vous êtes **autorisé** à
        accéder à l’administration.
      </p>

      <input
        style={s.input}
        placeholder="Entrer le code d’accès admin (67 caractères)"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      {error && <p style={s.error}>{error}</p>}

      <button style={s.button} onClick={handleAccess}>
        Continuer
      </button>
    </div>
  );
}

const s = {
  container: {
    background: "#000",
    minHeight: "100vh",
    color: "#fff",
    padding: 30,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: 500,
    margin: "0 auto",
  },
  title: {
    color: "#ff4444",
    marginBottom: 20,
    textAlign: "center",
  },
  text: {
    fontSize: 13,
    opacity: 0.8,
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    background: "#111",
    border: "1px solid #333",
    color: "#fff",
    padding: 10,
    borderRadius: 6,
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    background: "#a855f7",
    border: "none",
    padding: 10,
    borderRadius: 6,
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: 11,
    marginBottom: 10,
    textAlign: "center",
  },
};