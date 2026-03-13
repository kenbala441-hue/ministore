// src/screens/author/AuthorTermsScreen.jsx
import React, { useState } from "react";

export default function AuthorTermsScreen({ setView }) {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (accepted) {
      setView("author_submission"); // passe à l'écran suivant
    }
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h2 style={titleStyle}>Règles et Conditions pour devenir Auteur Comicrafte</h2>
        <div style={contentStyle}>
          <p>
            Avant de devenir un auteur certifié chez <span style={highlightStyle}>Comicrafte</span>, vous devez lire et accepter les règles ci-dessous :
          </p>
          <ol>
            <li>
              Toute histoire partagée sur l'application ou la plateforme <span style={highlightStyle}>Comicrafte</span> devient propriété du studio. Le studio peut l'utiliser pour promouvoir l'application.
            </li>
            <li>
              Si vous n'êtes pas encore éligible, vous ne pouvez pas générer de revenus. Vous devez respecter les règles imposées par le studio pour profiter de vos privilèges.
            </li>
            <li>
              Les parts de bénéfices sont claires : 
              <ul>
                <li>Utilisateur standard : 10%</li>
                <li>Utilisateur premium : 25-35%</li>
                <li>Utilisateur VIP / commercial : 50%</li>
              </ul>
            </li>
            <li>
              Si vous enfreignez les règles, Comicrafte peut suspendre ou bannir votre compte. Une réclamation est possible.
            </li>
          </ol>
        </div>

        <div style={{ marginTop: "20px" }}>
          <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={accepted}
              onChange={() => setAccepted(!accepted)}
              style={{ marginRight: "10px" }}
            />
            J'accepte les conditions
          </label>
          <button
            onClick={handleAccept}
            disabled={!accepted}
            style={{
              ...buttonStyle,
              backgroundColor: accepted ? "#00f0ff" : "#333",
              cursor: accepted ? "pointer" : "not-allowed",
            }}
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
}

const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#050505",
  padding: "20px",
};

const boxStyle = {
  maxWidth: "600px",
  width: "100%",
  backgroundColor: "#111",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 0 25px rgba(0,255,255,0.5)",
  border: "1px solid #00f0ff",
  color: "#fff",
  fontFamily: "Arial, sans-serif",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "20px",
  color: "#00f0ff",
  textShadow: "0 0 10px #00f0ff, 0 0 20px #00ff90",
};

const contentStyle = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#c0f0ff",
};

const highlightStyle = {
  color: "#00ff90",
  fontWeight: "bold",
  textShadow: "0 0 8px #00ff90",
};

const buttonStyle = {
  marginTop: "10px",
  padding: "12px",
  width: "100%",
  borderRadius: "8px",
  border: "none",
  fontWeight: "bold",
  color: "#050505",
  textTransform: "uppercase",
  fontSize: "14px",
  transition: "all 0.3s ease",
};