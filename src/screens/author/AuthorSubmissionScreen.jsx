// src/screens/author/AuthorSubmissionScreen.jsx
import React, { useState } from "react";
import "./AuthorSubmissionScreen.css";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useUserContext } from "../users/userContext";

export default function AuthorSubmissionScreen({ setView }) {

  const { user } = useUserContext();

  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [chapter, setChapter] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Utilisateur non connecté");
      return;
    }

    if (user.role !== "author") {
      alert("Seuls les auteurs peuvent publier");
      return;
    }

    if (!title || !synopsis || !chapter) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {

      setLoading(true);

      await addDoc(collection(db, "stories"), {
        title: title,
        synopsis: synopsis,
        content: chapter,
        author: user.username || "Auteur",
        authorId: user.uid,
        role: user.role,
        likes: 0,
        views: 0,
        comments: 0,
        chaptersCount: 1,
        status: "published",
        createdAt: serverTimestamp()
      });

      setTitle("");
      setSynopsis("");
      setChapter("");

      alert("Histoire publiée avec succès");

      setView("home");

    } catch (error) {
      console.error("Erreur Firestore:", error);
      alert("Erreur lors de la publication");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">

        <h2 className="title">Publier une histoire</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <input
              className="input"
              type="text"
              placeholder="Titre de l'histoire"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="textarea"
              rows={4}
              placeholder="Synopsis / Résumé"
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
            />

            <textarea
              className="textarea"
              rows={10}
              placeholder="Chapitre 1"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
            />

          </div>

          <button
            type="submit"
            className="button"
            disabled={loading}
          >
            {loading ? "Publication..." : "Publier"}
          </button>

        </form>

        <div className="submission-actions">

          <button
            className="button-purple"
            onClick={() => setView("author_dashboard")}
          >
            Retour Dashboard
          </button>

          <button
            className="button"
            onClick={() => setView("home")}
          >
            Retour Home
          </button>

        </div>

      </div>
    </div>
  );
}