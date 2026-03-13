// src/screens/author/AuthorSubmissionScreen.jsx
import React, { useState } from "react";
import "./AuthorSubmissionScreen.css";

export default function AuthorSubmissionScreen({ setView }) {
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [chapter, setChapter] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !synopsis || !chapter) return alert("Veuillez remplir tous les champs");
    setSubmitted(true);
    console.log("Histoire soumise:", { title, synopsis, chapter });
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">⚡ Soumettre votre histoire</h2>

        <form onSubmit={handleSubmit}>
          <label className="label">Titre de l'histoire</label>
          <input className="input" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Titre" />

          <label className="label">Synopsis</label>
          <textarea className="textarea" rows={5} value={synopsis} onChange={e => setSynopsis(e.target.value)} placeholder="Résumé de votre histoire..." />

          <label className="label">Chapitre 1</label>
          <textarea className="textarea" rows={12} value={chapter} onChange={e => setChapter(e.target.value)} placeholder="Écrivez le chapitre ici..." />

          <button type="submit" className="button">💜 Soumettre & Payer</button>
        </form>

        {submitted && (
          <p style={{ textAlign: "center", marginTop: 15, color: "#00ffea", fontWeight: "bold" }}>
            ✔ Histoire soumise avec succès !
          </p>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button className="button-purple" onClick={() => setView("author_dashboard")}>
            Retour au Dashboard
          </button>
          <button className="button" onClick={() => setView("author_contract")}>
            Revenir au Contrat
          </button>
        </div>
      </div>
    </div>
  );
}