// src/screens/author/AuthorDashboard.jsx
import React, { useState, useEffect } from "react";
import "./AuthorDashboardScreen.css";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  increment
} from "firebase/firestore";
import { useUserContext } from "../users/userContext";
import { Book, Plus, Zap, Heart, Eye, MessageCircle } from "lucide-react";

import AddStory from "./Components/AddStory";
import PublishButton from "./Components/PublishButton";

export default function AuthorDashboard({ setView }) {
  const { user } = useUserContext();

  const [myStories, setMyStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    stories: 0,
    chapters: 0,
    likes: 0,
    views: 0,
    comments: 0
  });

  const [activityFeed, setActivityFeed] = useState([]);

  const [newStory, setNewStory] = useState({
    title: "",
    synopsis: "",
    content: ""
  });

  // ---------- REAL TIME STORIES ----------
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "stories"),
      where("authorId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setMyStories(data);

      const totalChapters = data.reduce((acc, s) => acc + (s.chaptersCount || 1), 0);
      const totalLikes = data.reduce((acc, s) => acc + (s.likes || 0), 0);
      const totalViews = data.reduce((acc, s) => acc + (s.views || 0), 0);
      const totalComments = data.reduce((acc, s) => acc + (s.comments || 0), 0);

      setStats({
        stories: data.length,
        chapters: totalChapters,
        likes: totalLikes,
        views: totalViews,
        comments: totalComments
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // ---------- REAL TIME ACTIVITY ----------
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "activity"),
      where("authorId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setActivityFeed(data);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // ---------- CREATE STORY ----------
  const handlePublish = async () => {
    const { title, synopsis, content } = newStory;

    if (!title || !synopsis || !content) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      await addDoc(collection(db, "stories"), {
        title,
        synopsis,
        content,
        author: user.username || "Auteur",
        authorId: user.uid,
        likes: 0,
        views: 0,
        comments: 0,
        chaptersCount: 1,
        createdAt: serverTimestamp()
      });

      await addDoc(collection(db, "activity"), {
        authorId: user.uid,
        action: "Nouvelle histoire publiée",
        storyTitle: title,
        createdAt: serverTimestamp()
      });

      setNewStory({
        title: "",
        synopsis: "",
        content: ""
      });

    } catch (err) {
      console.error(err);
    }
  };

  // ---------- ADD VIEW ----------
  const simulateView = async (storyId) => {
    const storyRef = doc(db, "stories", storyId);
    await updateDoc(storyRef, {
      views: increment(1)
    });
  };

  return (
    <div className="author-dashboard-pro">

      {/* HEADER */}
      <header className="pro-header">
        <div className="header-inner">

          <div className="avatar-container">
            <div className="avatar-glow"></div>
            <div className="avatar-main">
              {user?.username?.charAt(0) || "U"}
            </div>
          </div>

          <div>
            <p className="username">
              Studio {user?.username || "Auteur"}
            </p>
            <p className="welcome">
              Rôle : <span className="neon-text">Auteur Certifié</span>
            </p>
          </div>

          <div className="icon-circle">
            <Zap size={20}/>
          </div>

        </div>
      </header>

      {/* STATS */}
      <section className="stats-mini-grid">

        <div className="mini-card">
          <Book size={18}/>
          <span className="mini-data val">{stats.stories}</span>
          <span className="mini-data lab">Histoires</span>
        </div>

        <div className="mini-card">
          <Plus size={18}/>
          <span className="mini-data val">{stats.chapters}</span>
          <span className="mini-data lab">Chapitres</span>
        </div>

        <div className="mini-card">
          <Heart size={18}/>
          <span className="mini-data val">{stats.likes}</span>
          <span className="mini-data lab">Likes</span>
        </div>

        <div className="mini-card">
          <Eye size={18}/>
          <span className="mini-data val">{stats.views}</span>
          <span className="mini-data lab">Vues</span>
        </div>

        <div className="mini-card">
          <MessageCircle size={18}/>
          <span className="mini-data val">{stats.comments}</span>
          <span className="mini-data lab">Commentaires</span>
        </div>

      </section>

      {/* STORIES */}
      <section className="section-container">

        <h3 className="section-title">
          <Book size={18}/> Mes Histoires
        </h3>

        {loading ? (
          <p>Chargement...</p>
        ) : (

          <div className="gauge-list">

            {myStories.length === 0 && (
              <p>Aucune histoire publiée.</p>
            )}

            {myStories.map(story => (

              <div key={story.id} className="gauge-card pro">

                <div className="card-info">
                  <h4>{story.title}</h4>

                  <p className="sub-text">
                    {story.chaptersCount || 1} Chapitres • {story.views || 0} vues • {story.likes || 0} likes
                  </p>
                </div>

                <div className="card-actions">

                  <PublishButton
                    label="Ajouter chapitre"
                    onClick={() => setView("author_submission")}
                  />

                  <button
                    className="btn-view"
                    onClick={() => simulateView(story.id)}
                  >
                    +1 vue
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* CREATE STORY COMPONENT */}
      <AddStory
        newStory={newStory}
        setNewStory={setNewStory}
        handlePublish={handlePublish}
      />

      {/* ACTIVITY FEED */}
      <section className="feed-card">

        <h3 className="section-title">
          Activité récente
        </h3>

        {activityFeed.length === 0 && (
          <p>Aucune activité.</p>
        )}

        {activityFeed.map(feed => (

          <div key={feed.id} className="feed-item">

            <div className="user-dot">
              {user?.username?.charAt(0)}
            </div>

            <div>
              <p>{feed.action}</p>
              <span className="sub-text">{feed.storyTitle}</span>
            </div>

          </div>

        ))}

      </section>

      {/* FLOAT BUTTON */}
      <button
        className="fab-main-neon"
        onClick={() => setView("author_submission")}
      >
        <Plus size={28}/>
      </button>

    </div>
  );
}