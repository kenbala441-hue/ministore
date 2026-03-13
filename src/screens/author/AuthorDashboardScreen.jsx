// src/screens/author/AuthorDashboard.jsx
import React, { useState, useEffect } from "react";
import "./AuthorDashboardScreen.css";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";
import { useUserContext } from "../users/userContext";

export default function AuthorDashboard({ setView }) {
  const { user } = useUserContext();

  // ---------- EXISTING DATA ----------
  const [stories, setStories] = useState([
    { id: 1, title: "Les Héritiers de l'Oubli", chapters: 5 },
    { id: 2, title: "Spirituel Stotemr", chapters: 3 },
    { id: 3, title: "On My Being", chapters: 1 },
  ]);

  const [feed, setFeed] = useState([
    { id: 1, user: "Alice", action: "a commenté votre chapitre", story: "Les Héritiers de l'Oubli" },
    { id: 2, user: "Bob", action: "a liké votre histoire", story: "Spirituel Stotemr" },
    { id: 3, user: "Charlie", action: "a publié un nouveau chapitre", story: "On My Being" },
  ]);

  const stats = [
    { label: "Histoires", val: stories.length },
    { label: "Chapitres", val: stories.reduce((acc, s) => acc + s.chapters, 0) },
    { label: "Vues", val: 1240 },
    { label: "Likes", val: 432 },
    { label: "Commentaires", val: 89 },
    { label: "Messages", val: 12 },
    { label: "Abonnés", val: 320 },
    { label: "Revenus", val: "$540" },
    { label: "Claps", val: 780 },
    { label: "Partages", val: 56 },
    { label: "Notifications", val: 14 },
  ];

  // ---------- NEW STATE FOR ADD STORY ----------
  const [title, setTitle] = useState("");
  const [chapter, setChapter] = useState("");
  const [content, setContent] = useState("");
  const [storyFeed, setStoryFeed] = useState([]);

  // ---------- LOAD STORIES FROM FIRESTORE ----------
  useEffect(() => {
    const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setStoryFeed(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // ---------- ADD STORY FUNCTION ----------
  const handleSubmit = async () => {
    if (!title || !content) return alert("Remplis tout 😅");
    if (!user) return alert("Vous devez être connecté");

    await addDoc(collection(db, "stories"), {
      title,
      chapter,
      content,
      author: user.username,
      authorId: user.uid,
      createdAt: serverTimestamp(),
    });

    alert("✅ Histoire publiée !");
    setTitle("");
    setChapter("");
    setContent("");
  };

  return (
    <div className="author-dashboard-pro">
      {/* ---------- HEADER ---------- */}
      <header className="pro-header">
        <div className="header-inner">
          <div style={{ position: "relative" }}>
            <div className="avatar-glow"></div>
            <div className="avatar-main">K</div>
          </div>
          <div>
            <p className="username">{user?.username || "Kinkarou"}</p>
            <p className="welcome">Bienvenue à votre Studio Auteur</p>
          </div>
          <div className="icon-circle">⚡</div>
        </div>
      </header>

      {/* ---------- STATS ---------- */}
      <section className="stats-mini-grid">
        {stats.map((s, i) => (
          <div key={i} className="mini-card">
            <span className="mini-data val">{s.val}</span>
            <span className="mini-data lab">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ---------- GAUGE / STORIES ---------- */}
      <section className="gauge-section">
        {stories.map(story => (
          <div key={story.id} className="gauge-card">
            <div>
              <h4>{story.title}</h4>
              <p>Chapitres publiés : {story.chapters}</p>
            </div>
            <button className="btn-text" onClick={() => setView("author_submission")}>
              Ajouter un chapitre
            </button>
          </div>
        ))}
      </section>

      {/* ---------- ADD NEW STORY ---------- */}
      <section className="add-story-section">
        <h3>📖 Publier une nouvelle histoire</h3>
        <input
          placeholder="Titre"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          placeholder="Chapitre / Sous-titre"
          value={chapter}
          onChange={e => setChapter(e.target.value)}
        />
        <textarea
          placeholder="Contenu"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button className="btn-text" onClick={handleSubmit}>Publier l'histoire</button>
      </section>

      {/* ---------- STORY FEED ---------- */}
      <section className="feed-card">
        <h3>Feed des histoires publiées</h3>
        {storyFeed.map(s => (
          <div key={s.id} style={{ borderBottom: "1px solid #ccc", marginBottom: 20, paddingBottom: 5 }}>
            <h4>{s.title}</h4>
            <h5>{s.chapter}</h5>
            <p>{s.content}</p>
            <small>Par {s.author}</small>
          </div>
        ))}
      </section>

      {/* ---------- FEED / ACTIVITE ---------- */}
      <section className="feed-card">
        <h3>Activité récente</h3>
        {feed.map(f => (
          <div key={f.id} className="feed-item">
            <div className="user-dot">{f.user.charAt(0)}</div>
            <div>
              <p>{f.user} {f.action}</p>
              <span className="sub-text">{f.story}</span>
            </div>
          </div>
        ))}
      </section>

      {/* ---------- FLOAT BUTTON ---------- */}
      <button className="fab-main" onClick={() => setView("author_submission")}>➕</button>
    </div>
  );
}