// AuthorCardTest.jsx
import React from "react";

function generateFakeAccessCode(length = 35) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Faux auteur pour test
const fakeAuthor = {
  fullName: "Ken Mikael",
  pseudo: "AnimeMaster",
  city: "Kinshasa",
  level: "Pro",
  accessCode: generateFakeAccessCode(),
  joinedAt: new Date().toLocaleDateString(),
  photoURL: "", // optionnel
  email: "kenmikael@test.com", // optionnel
  status: "Validé",
};

export default function AuthorCardTest({ setView }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#111",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(0,0,0,0.6)",
        }}
      >
        <h2 style={{ marginBottom: "15px" }}>Carte d'Auteur (Test)</h2>

        <div style={{ marginBottom: "10px" }}>
          <strong>Nom complet :</strong> {fakeAuthor.fullName}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <strong>Pseudo :</strong> {fakeAuthor.pseudo}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <strong>Ville :</strong> {fakeAuthor.city}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <strong>Niveau :</strong> {fakeAuthor.level}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <strong>Code d’accès :</strong> {fakeAuthor.accessCode}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <strong>Date d’inscription :</strong> {fakeAuthor.joinedAt}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <strong>Photo de profil :</strong> {fakeAuthor.photoURL || "Aucune"}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <strong>Email / Contact :</strong> {fakeAuthor.email || "Aucun"}
        </div>
        <div style={{ marginBottom: "20px" }}>
          <strong>Statut :</strong> {fakeAuthor.status}
        </div>

        <button
          onClick={() => setView("author_access")}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "#6c5ce7",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Retour à l'accès auteur
        </button>
      </div>
    </div>
  );
}