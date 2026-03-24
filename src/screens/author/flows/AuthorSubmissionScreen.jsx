import React, { useState } from "react";
import "./AuthorSubmissionScreen.css";
import { db } from "../../../firebase/index.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useUserContext } from "../../users/userContext";
import { motion } from "framer-motion";

export default function AuthorSubmissionScreen({ setView }) {
  const { user } = useUserContext();
  const isAuthor = user?.role === "author";

  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [chapter, setChapter] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthor) {
      alert("Seuls les auteurs peuvent publier.");
      return;
    }

    if (!title || !synopsis || !chapter) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "stories"), {
        title,
        synopsis,
        content: chapter,
        author: user.username,
        authorId: user.uid,
        role: user.role,
        likes: 0,
        views: 0,
        comments: 0,
        chaptersCount: 1,
        status: "published",
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setSynopsis("");
      setChapter("");
      alert("Histoire publiée avec succès !");
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
        <div className="header">
          <h2 className="title">Publier une histoire</h2>
          {isAuthor && <span className="badge-author">Auteur</span>}
        </div>

        <form onSubmit={handleSubmit} className="submission-form">

          <motion.input
            className="input"
            type="text"
            placeholder="Titre de l'histoire"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            whileFocus={{ scale: 1.02 }}
          />

          <motion.textarea
            className="textarea"
            rows={4}
            placeholder="Synopsis / Résumé"
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            whileFocus={{ scale: 1.02 }}
          />

          <motion.textarea
            className="textarea"
            rows={10}
            placeholder="Chapitre 1"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            whileFocus={{ scale: 1.02 }}
          />

          <motion.button
            type="submit"
            className="button"
            disabled={loading || !isAuthor}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Publication..." : "Publier"}
          </motion.button>

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