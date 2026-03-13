import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase/index.js";

// Components

import Header from "../components/Header";
import Tabs from "../components/Tabs";
import GenreScroll from "../components/GenreScroll";
import HeroSection from "../components/HeroSection";
import TrendingGrid from "../components/TrendingGrid";
import TopCreator from "../components/TopCreator";
import NewStory from "../components/NewStory";
import NewsCard from "../components/NewsCard";
// Home

import HomeSectionWrapper from "./HomeSectionWrapper";
import Recommendation from "./Recommendation";
import Featured from "./Featured";


const GENRES = [
  "Tous","Action","Horreur","Romance","Aventure","Sci-Fi","Drame","Comédie","Dark Romance",
  "Reincarnation","Level Up","Amateurs","Humour","Mystère","Fantastique","Épique","Slice of Life",
  "Sport","Musique","Histoire","Psychologique","Thriller","Magie","Monde Virtuel","Enquête"
];

const NEON_COLORS = ["#ff003c","#00f7ff","#ff00ff","#39ff14","#ffd300","#8f00ff"];

export default function Home({ setView, setSelectedStory, toggleBurger }) {
  const [stories, setStories] = useState([]);
  const [activeGenre, setActiveGenre] = useState("Tous");
  const [notifCount, setNotifCount] = useState(3);
  const [creators, setCreators] = useState([]);

  // Couleur néon aléatoire
  const neonColor = useMemo(() => NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)], []);

  // 🔄 Récupération stories Firestore
  useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "stories"), snapshot =>
    setStories(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
  );
  return () => unsubscribe();
}, []);

  // 👤 Créateurs top statiques
  useEffect(() => {
    setCreators([
      { id: 1, name: 'Alice', avatar: '/avatars/a1.png' },
      { id: 2, name: 'Bob', avatar: '/avatars/b1.png' },
      { id: 3, name: 'Cleo', avatar: '/avatars/c1.png' },
    ]);
  }, []);

  // 🔍 Filtrage par genre
  const filteredStories = useMemo(() => 
    stories.filter(st => activeGenre === "Tous" || st.genres?.includes(activeGenre))
  , [stories, activeGenre]);

  // Fonction pour récupérer la cover
  const getCover = (story) => story.coverImage || story.cover || story.pages?.find(p => p.type === 'image')?.src || "https://via.placeholder.com/300x400/111111/00fff2?text=No+Cover";

  return (
    <div style={{
      background: `radial-gradient(circle at 50% 0%, ${neonColor}11, #050505 70%)`,
      minHeight: '100vh',
      padding: '0 15px 100px 15px',
      color: 'white',
      fontFamily: 'sans-serif',
      transition: 'background 0.5s ease'
    }}>
      {/* Header + Notifications */}
      <Header toggleBurger={toggleBurger} setView={setView} notifCount={notifCount} />

      {/* Tabs Accueil / Nouveautés / Mes séries */}
      <Tabs setView={setView} />

      {/* Scroll genres */}
      <GenreScroll genres={GENRES} activeGenre={activeGenre} setActiveGenre={setActiveGenre} neonColor={neonColor} />

      {/* Hero Section */}
      {filteredStories[0] && (
        <HeroSection
          story={filteredStories[0]}
          setSelectedStory={setSelectedStory}
          setView={setView}
          getCover={getCover}
        />
      )}

      {/* Trending / Actuelles */}
      <TrendingGrid
        stories={filteredStories.slice(1)}
        setSelectedStory={setSelectedStory}
        setView={setView}
        getCover={getCover}
        neonColor={neonColor}
      />

      {/* Top creators */}
      <TopCreator creators={creators} setView={setView} neonColor={neonColor} />

      {/* Nouveautés (section cards) */}
      <div style={{marginTop: '20px'}}>
        {filteredStories.slice(0,3).map(story => (
          <NewStory
            key={story.id}
            story={story}
            setSelectedStory={setSelectedStory}
            setView={setView}
            getCover={getCover}
            neonColor={neonColor}
          />
        ))}
      </div>

      {/* NewsCards (section supplémentaire) */}
      <div style={{marginTop: '20px'}}>
        {filteredStories.slice(3,6).map(news => (
          <NewsCard
            key={news.id}
            news={news}
            setView={setView}
            neonColor={neonColor}
          />
        ))}
      </div>

      {/* Scrollbar néon */}
      <style>
        {`
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-thumb {
            background: ${neonColor};
            border-radius: 4px;
          }
        `}
      </style>
    </div>
  );
}