import React, { useState } from "react";

function AuthorAccessScreen({ setView, setAuthorData }) {
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");

  // 🔹 Base de codes d'accès test
  const fakeDatabaseCodes = [
    "ABCDEF1234567890XYZABCDEF1234567890",
    "ZYX9876543210QWERTY1234567890ASDFG",
    "TESTACCESSCODE1234567890123456789"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!accessCode.trim()) {
      setError("Veuillez entrer votre carte d'accès.");
      return;
    }

    // Vérifie si le code existe
    const matchedCode = fakeDatabaseCodes.find((c) => c === accessCode);

    if (!matchedCode) {
      setError("Code non reconnu. Veuillez vérifier votre carte d'accès.");
      return;
    }

    setError("");

    // 🔹 Crée un objet temporaire auteur pour la vérification
    setAuthorData({
      accessCode: matchedCode,
      fullName: "",
      pseudo: "",
      city: "",
      level: "Débutant",
      photoURL: "",
      email: "",
      status: "En attente",
    });

    // 🔹 Redirection vers l'écran pour compléter l'identité
    setView("author_identity");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#111",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(0,0,0,0.6)"
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>Entrer votre carte d'accès</h2>
        <p style={{ fontSize: "14px", opacity: 0.8, marginBottom: "20px" }}>
          Entrez votre code d'accès (35 caractères) présent sur votre carte.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="Entrer le code"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              marginBottom: "15px",
              outline: "none",
              fontSize: "14px"
            }}
          />

          {error && (
            <div style={{ color: "#ff4d4d", marginBottom: "10px", fontSize: "13px" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              background: "#6c5ce7",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Valider
          </button>
        </form>

        <div
          onClick={() => setView("author_apply")}
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontSize: "13px",
            opacity: 0.8,
            cursor: "pointer"
          }}
        >
          Recommandation / Demande auteur
        </div>
      </div>
    </div>
  );
}

export default AuthorAccessScreen;