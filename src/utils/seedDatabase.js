import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "../../../firebase/index.js";

// Components UI
import Header from "../components/Header";
import Tabs from "../components/Tabs";
import GenreScroll from "../components/GenreScroll";
import HeroSection from "../components/HeroSection";
import TrendingGrid from "../components/TrendingGrid";
import TopCreator from "../components/TopCreator";
import NewStory from "../components/NewStory";
import NewsCard from "../components/NewsCard";

// Configuration des constantes
const GENRES = [
  "Tous","Action","Horreur","Romance","Aventure","Sci-Fi","Drame","Comédie",
  "Dark Romance","Reincarnation","Level Up","Amateurs","Humour","Mystère",
  "Fantastique","Épique","Slice of Life","Sport","Musique","Histoire",
  "Psychologique","Thriller","Magie","Monde Virtuel","Enquête"
];

const NEON_COLORS = ["#ff003c","#00f7ff","#ff00ff","#39ff14","#ffd300","#8f00ff"];

/**
 * COMPOSANT HOME - VERSION PRO FINALE
 * Gère l'affichage dynamique, les néons et les 12 classiques gratuits.
 */
export default function Home({ setView, setSelectedStory, toggleBurger }) {
  // États pour les données
  const [stories, setStories] = useState([]);
  const [activeGenre, setActiveGenre] = useState("Tous");
  const [notifCount, setNotifCount] = useState(3);
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  // Génération d'une couleur néon persistante pour la session
  const neonColor = useMemo(() => NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)], []);

  // 📡 ÉCOUTE FIRESTORE : Récupère les 20 dernières stories
  useEffect(() => {
    const q = query(collection(db, "stories"), orderBy("viewsCount", "desc"), limit(20));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedStories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStories(fetchedStories);
      setLoading(false);
    }, (error) => {
      console.error("Erreur Firestore:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 👤 CRÉATEURS : Simulation de données (à remplacer par Firestore plus tard si besoin)
  useEffect(() => {
    setCreators([
      { id: 1, name: 'Shadow Artist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
      { id: 2, name: 'Manga Queen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
      { id: 3, name: 'Pixel Master', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' },
      { id: 4, name: 'Ink Lord', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4' },
    ]);
  }, []);

  // 🔍 LOGIQUE DE FILTRAGE
  const filteredStories = useMemo(() => {
    return stories.filter(st => activeGenre === "Tous" || (st.genres && st.genres.includes(activeGenre)));
  }, [stories, activeGenre]);

  // 🖼️ HELPER : Récupération de l'image de couverture
  const getCover = (story) => {
    if (!story) return "https://via.placeholder.com/300x400/111111/00fff2?text=No+Cover";
    return story.coverImage || story.cover || (story.pages && story.pages[0]?.src) || "https://via.placeholder.com/300x400";
  };

  // 🕒 GESTION DE L'AFFICHAGE DU CHARGEMENT
  if (loading) {
    return (
      <div style={{ background: '#050505', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: neonColor, fontSize: '20px', fontWeight: 'bold', animation: 'pulse 1.5s infinite' }}>
          CHARGEMENT DE COMICCRAFT...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: `radial-gradient(circle at 50% 0%, ${neonColor}15, #050505 80%)`,
      minHeight: '100vh',
      padding: '0 15px 100px 15px',
      color: 'white',
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      transition: 'background 0.5s ease'
    }}>
      {/* 1. HEADER & NAVIGATION */}
      <Header toggleBurger={toggleBurger} setView={setView} notifCount={notifCount} />
      <Tabs setView={setView} />

      {/* 2. FILTRES DE GENRE */}
      <GenreScroll 
        genres={GENRES} 
        activeGenre={activeGenre} 
        setActiveGenre={setActiveGenre} 
        neonColor={neonColor} 
      />

      {/* 3. SECTION À LA UNE (HERO) */}
      {filteredStories.length > 0 ? (
        <HeroSection 
          story={filteredStories[0]} 
          setSelectedStory={setSelectedStory} 
          setView={setView} 
          getCover={getCover} 
        />
      ) : (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          Aucune histoire trouvée dans ce genre.
        </div>
      )}

      {/* 4. SECTION : LES 12 CLASSIQUES GRATUITS */}
      <div style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ 
            fontSize: '1.4rem', 
            color: neonColor, 
            textShadow: `0 0 10px ${neonColor}55`,
            margin: 0 
          }}>
            📚 Classiques Gratuits
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#888' }}>VOIR TOUT</span>
        </div>
        
        <TrendingGrid 
          stories={filteredStories.slice(1, 13)} // On prend les 12 suivantes après la Hero
          setSelectedStory={setSelectedStory} 
          setView={setView} 
          getCover={getCover} 
          neonColor={neonColor} 
        />
      </div>

      {/* 5. TOP CRÉATEURS */}
      <TopCreator creators={creators} setView={setView} neonColor={neonColor} />

      {/* 6. NOUVEAUTÉS (Format Liste Dynamique) */}
      <div style={{ marginTop: '30px' }}>
        <h3 style={{ marginBottom: '15px', fontSize: '1.2rem', borderLeft: `4px solid ${neonColor}`, paddingLeft: '10px' }}>
          🔥 Récemment Ajoutés
        </h3>
        {filteredStories.slice(13, 18).map(story => (
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

      {/* 7. NEWS ET ACTUALITÉS DU STUDIO */}
      <div style={{ marginTop: '30px', paddingBottom: '20px' }}>
        <h3 style={{ marginBottom: '15px', fontSize: '1.2rem' }}>📰 News ComicCraft</h3>
        {filteredStories.length > 5 ? (
          filteredStories.slice(0, 2).map(news => (
            <NewsCard 
              key={`news-${news.id}`} 
              news={news} 
              setView={setView} 
              neonColor={neonColor} 
            />
          ))
        ) : (
          <div style={{ background: '#111', padding: '20px', borderRadius: '10px', color: '#555' }}>
            Restez connectés pour les prochaines actus !
          </div>
        )}
      </div>

      {/* STYLES CSS INJECTÉS */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
          ::-webkit-scrollbar { width: 5px; }
          ::-webkit-scrollbar-track { background: #050505; }
          ::-webkit-scrollbar-thumb { 
            background: ${neonColor}; 
            border-radius: 10px;
          }
          * { box-sizing: border-box; }
        `}
      </style>
    </div>
  );
}
