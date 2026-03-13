import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from '../../firebase';

// Components
import Header from './components/Header';
import Tabs from './components/Tabs';
import GenreScroll from './components/GenreScroll';
import HeroSection from './components/HeroSection';
import TrendingGrid from './components/TrendingGrid';
import TopCreator from './components/TopCreator';
import NewStory from './components/NewStory';
import NewsCard from './components/NewsCard';

const GENRES = ["Tous","Action","Horreur","Romance","Aventure","Sci-Fi","Drame","Comédie","Dark Romance"];
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
    const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, snapshot => 
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
  const filteredStories = stories.filter(st => activeGenre === "Tous" || st.genres?.includes(activeGenre));

  return (
    <div style={{
      background: `radial-gradient(circle at 50% 0%, ${neonColor}11, #050505 70%)`,
      minHeight: '100vh',
      padding: '0 15px 100px 15px',
      color: 'white',
      fontFamily: 'sans-serif',
      transition: 'background 0.5s ease'
    }}>
      <Header toggleBurger={toggleBurger} setView={setView} notifCount={notifCount} />

      <Tabs setView={setView} />

      <GenreScroll genres={GENRES} activeGenre={activeGenre} setActiveGenre={setActiveGenre} neonColor={neonColor} />

      <HeroSection story={filteredStories[0]} setSelectedStory={setSelectedStory} setView={setView} />

      <TrendingGrid stories={filteredStories} setSelectedStory={setSelectedStory} setView={setView} neonColor={neonColor} />

      <TopCreator creators={creators} setView={setView} neonColor={neonColor} />

      {/* Nouveautés */}
      {filteredStories.slice(0,3).map(story => (
        <NewStory key={story.id} story={story} setSelectedStory={setSelectedStory} setView={setView} neonColor={neonColor} />
      ))}

      {filteredStories.slice(3,6).map(news => (
        <NewsCard key={news.id} news={news} setView={setView} neonColor={neonColor} />
      ))}

      <style>
        {`
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-thumb {
            background: ${neonColor};
            border-radius: 4px;
          }
        `}
      </style>
    </div>
  );
}