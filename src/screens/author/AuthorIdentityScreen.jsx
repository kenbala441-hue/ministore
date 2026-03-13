import React, { useState } from "react";

export default function AuthorIdentityScreen({ setView }) {
  const [fullName, setFullName] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [city, setCity] = useState("");
  const [level, setLevel] = useState("Débutant");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fullName || !pseudo || !city) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setError("");
    // Après validation locale, passe aux termes et contrat
    setView("author_terms");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "white", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "400px", background: "#111", padding: "30px", borderRadius: "12px", boxShadow: "0 0 20px rgba(0,0,0,0.6)" }}>
        <h2 style={{ marginBottom: "15px" }}>Vérification d'identité</h2>

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Nom complet" value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} />
          <input type="text" placeholder="Pseudo" value={pseudo} onChange={e => setPseudo(e.target.value)} style={inputStyle} />
          <input type="text" placeholder="Ville" value={city} onChange={e => setCity(e.target.value)} style={inputStyle} />
          <select value={level} onChange={e => setLevel(e.target.value)} style={inputStyle}>
            <option>Débutant</option>
            <option>Confirmé</option>
            <option>Pro</option>
          </select>

          {error && <div style={{ color: "#ff4d4d", marginBottom: "10px", fontSize: "13px" }}>{error}</div>}

          <button type="submit" style={buttonStyle}>Valider</button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  marginBottom: "15px",
  outline: "none",
  fontSize: "14px"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "#6c5ce7",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer"
};