// src/screens/author/Components/PublishButton.jsx
import React from "react";

export default function PublishButton({ currentUser, onClick }) {

  // bouton visible uniquement pour les auteurs
  if (!currentUser || currentUser.role !== "author") return null;

  return (
    <button
      style={{
        padding: "10px 20px",
        backgroundColor: "#00f5d4",
        color: "#000",
        borderRadius: "8px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 0 10px #00f5d4",
        margin: "10px 0",
        border: "none"
      }}
      onClick={onClick}
    >
      Accéder à votre Dashboard
    </button>
  );
}