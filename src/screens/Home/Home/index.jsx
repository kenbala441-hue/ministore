import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  limit,
} from "firebase/firestore";
import { db } from "../../../firebase/index.js";

// ✅ IMPORTS CORRIGÉS (Directement depuis les fichiers)
import Header from "../components/Header";
import Tabs from "../components/Tabs";
import HeroSection from "../components/HeroSection";
import TrendingGrid from "../components/TrendingGrid";
import TopCreator from "../components/TopCreator";
import ComicCrafteVertical from '../components/ComicCrafteVertical';
import TrendingScroll from '../components/TrendingScroll';

import NewStory from "../components/NewStory";
import NewsCard from "../components/NewsCard";
import PublicStoriesSection from "../components/PublicStoriesSection";
import GenreScroll from "../components/GenreScroll"; // Ajouté ici

// ================= CONFIG =================
const GENRES = [
  "Tous","Action","Horreur","Romance","Aventure","Sci-Fi",
  "Drame","Comédie","Fantastique","Enquête"
];

const NEON_COLORS = [
  "#ff003c","#00f7ff","#ff00ff","#39ff14","#ffd300","#8f00ff"
];

const PRO_LIBRARY = [
  {
    id: 11,
    title: "Alice in Wonderland",
    genres: ["Fantastique"],
    folder: "alice",
    viewsCount: 1200,
    coverImage: "https://www.gutenberg.org/cache/epub/11/pg11.cover.medium.jpg"
  },
  {
    id: 1661,
    title: "Sherlock Holmes",
    genres: ["Enquête"],
    folder: "sherlock",
    viewsCount: 3500,
    coverImage: "https://www.gutenberg.org/cache/epub/1661/pg1661.cover.medium.jpg"
  },
  {
    id: 345,
    title: "Dracula",
    genres: ["Horreur"],
    folder: "dracula",
    viewsCount: 2800,
    coverImage: "https://www.gutenberg.org/cache/epub/345/pg345.cover.medium.jpg"
  }
];

// ================= COMPONENTS UTILS =================
const Section = ({ title, children, color }) => (
  <section style={{ marginTop: 30 }}>
    <h3
      style={{
        fontSize: 14,
        fontWeight: "bold",
        textTransform: "uppercase",
        marginBottom: 12,
        color: color || "#fff",
      }}
    >
      {title}
    </h3>
    {children}
  </section>
);

// ================= MAIN COMPONENT =================
export default function Home({ setView, setSelectedStory, setSelectedUser, toggleBurger }) {
  const [stories, setStories] = useState([]);
  const [classics, setClassics] = useState([]);
  const [publicStories, setPublicStories] = useState([]);
  const [activeGenre, setActiveGenre] = useState("Tous");

  const neonColor = useMemo(
    () => NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
    []
  );

  // ================= FIREBASE =================
  useEffect(() => {
    const q = query(collection(db, "stories"), orderBy("viewsCount", "desc"), limit(30));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter(Boolean);
      const normal = data.filter((s) => !s.folder);
      const classicDB = data.filter((s) => s.folder);
      setStories(normal);
      setClassics(classicDB.length ? classicDB : PRO_LIBRARY);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "publish"), orderBy("createdAt", "desc"), limit(20));
    const unsub = onSnapshot(q, (snap) => {
      setPublicStories(snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter(Boolean));
    });
    return () => unsub();
  }, []);

  // ================= DATA =================
  const creators = useMemo(() => [
    { id: 1, username: "alice", photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=1" },
    { id: 2, username: "bob", photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=2" },
    { id: 3, username: "cleo", photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=3" },
  ], []);

  const filteredStories = useMemo(() =>
    stories.filter((st) => activeGenre === "Tous" || st.genres?.includes(activeGenre)),
    [stories, activeGenre]
  );

  const getCover = useCallback((story) =>
    story?.coverImage ||
    story?.cover ||
    story?.pages?.find((p) => p.type === "image")?.src ||
    "https://via.placeholder.com/300x400/111/fff?text=No+Cover",
    []
  );

  const handleSelectStory = useCallback((story) => {
    setSelectedStory(story);
    setView(story?.folder ? "reader" : "story");
  }, [setSelectedStory, setView]);

  const heroStory = publicStories[0] || filteredStories[0] || classics[0] || PRO_LIBRARY[0];

  const generateClassics = async () => {
    try {
      for (const item of PRO_LIBRARY) {
        await addDoc(collection(db, "stories"), item);
      }
      alert("Classiques injectés");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'injection");
    }
  };

  // ================= RENDER =================
  return (
    <div
      style={{
        background: `radial-gradient(circle at 50% 0%, ${neonColor}15, #050505 80%)`,
        minHeight: "100vh",
        padding: "0 12px 100px 12px",
        color: "white",
      }}
    >
      <Header toggleBurger={toggleBurger} setView={setView} />
      <Tabs setView={setView} />
      
      {/* Utilisation du composant GenreScroll */}
      <GenreScroll
        genres={GENRES}
        activeGenre={activeGenre}
        setActiveGenre={setActiveGenre}
        neonColor={neonColor}
      />

      {heroStory && (
        <HeroSection
          story={heroStory}
          setSelectedStory={handleSelectStory}
          setView={setView}
          getCover={getCover}
        />
      )}

      <TopCreator creators={creators} setView={setView} setSelectedUser={setSelectedUser} neonColor={neonColor} />

      <Section title="✨ Recommandations" color={neonColor}>
        <TrendingGrid stories={filteredStories.slice(0, 6)} setSelectedStory={handleSelectStory} setView={setView} getCover={getCover} neonColor={neonColor} />
      </Section>

      <Section title="📚 Bibliothèque Gratuite">
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={generateClassics} style={{ background: "none", border: "none", color: neonColor, fontSize: 12, cursor: "pointer" }}>
            Générer
          </button>
        </div>
        <TrendingGrid stories={classics} setSelectedStory={handleSelectStory} setView={setView} getCover={getCover} neonColor={neonColor} />
      </Section>

      {publicStories.length > 0 && (
        <Section title="🌍 Communauté">
          <TrendingGrid stories={publicStories} setSelectedStory={handleSelectStory} setView={setView} getCover={getCover} neonColor={neonColor} />
        </Section>
      )}

{/* 1. LE TOP HORIZONTAL */}
<Section title="🔥 TOP LECTURES" color="#FFD700">
  <TrendingScroll 
    setView={setView} 
    setSelectedStory={setSelectedStory} 
  />
</Section>

{/* 2. LES EXCLUSIVITÉS VERTICALES (Importé) */}
<Section title="✨ EXCLUSIVITÉS COMICCRAFTE" color={neonColor}>
  <ComicCrafteVertical 
    handleSelectStory={handleSelectStory} 
    neonColor={neonColor} 
  />
</Section>


      <PublicStoriesSection setSelectedStory={handleSelectStory} setView={setView} neonColor={neonColor} />

      <Section title="🆕 Nouveautés">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredStories.slice(6, 10).map((story) => (
            <NewStory key={story.id} story={story} setSelectedStory={handleSelectStory} setView={setView} getCover={getCover} neonColor={neonColor} />
          ))}
        </div>
      </Section>

      <Section title="📰 News">
        {filteredStories.slice(10, 14).map((news) => (
          <NewsCard key={news.id} news={news} setView={setView} neonColor={neonColor} />
        ))}
      </Section>

      <style>
        {`
          ::-webkit-scrollbar { width: 0px; background: transparent; }
          div { scrollbar-width: none; }
        `}
      </style>
    </div>
  );
}
