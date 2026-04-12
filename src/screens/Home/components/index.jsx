// src/screens/Home/components/index.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";

// ✅ IMPORTS CORRIGÉS
import Header from './Header';
import Tabs from './Tabs';
import HeroSection from './HeroSection';
import TrendingGrid from './TrendingGrid';
import TopCreator from './TopCreator';
import NewStory from './NewStory';
import NewsCard from './NewsCard';

const GENRES = ["Tous","Action","Horreur","Romance","Aventure","Sci-Fi","Drame","Comédie","Dark Romance"];
const NEON_COLORS = ["#ff003c","#00f7ff","#ff00ff","#39ff14","#ffd300","#8f00ff"];
// ... après le composant Section
const Section = ({ title, children, color }) => (
  <section style={{ marginTop: 30 }}>
    <h3 style={{ fontSize: 14, fontWeight: "bold", textTransform: "uppercase", marginBottom: 12, color: color || "#fff" }}>
      {title}
    </h3>
    {children}
  </section>
);

// COLLES LE "const s" ICI :
const s = {
  verticalCard: {
    display: 'flex',
    gap: '12px',
    backgroundColor: '#0f0f0f',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid #1a1a1a',
    height: '110px',
    marginBottom: '12px'
  },
  vThumb: { width: '80px', height: '110px', objectFit: 'cover' },
  vDetails: { flex: 1, padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  vHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  vGenre: { fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' },
  vStatus: { fontSize: '8px', background: '#a855f7', padding: '2px 6px', borderRadius: '4px', color: '#fff' },
  vTitle: { fontSize: '16px', fontWeight: 'bold', color: '#fff' },
  vDesc: { fontSize: '11px', color: '#666' },
  vFooter: { display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#444' }
};

export default function Home({ setView, setSelectedStory, setSelectedUser, toggleBurger }) {
  const [stories, setStories] = useState([]);
  const [classics, setClassics] = useState([]);
  const [activeGenre, setActiveGenre] = useState("Tous");
  const [creators, setCreators] = useState([]);

  const neonColor = useMemo(
    () => NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
    []
  );

  // 🔥 FIRESTORE (avec sécurité)
  useEffect(() => {
    try {
      const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(
        q,
        snapshot => {
          const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setStories(data.filter(s => !s.folder));
          setClassics(data.filter(s => s.folder));
        },
        (error) => {
          console.error("Firestore error:", error?.message);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Erreur Firestore init:", err?.message);
    }
  }, []);

  // 👤 Créateurs fallback
  useEffect(() => {
    setCreators([
      { id: 1, username: 'alice', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
      { id: 2, username: 'bob', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
      { id: 3, username: 'cleo', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' },
    ]);
  }, []);

  const filteredStories = useMemo(() => 
    stories.filter(st => activeGenre === "Tous" || st.genres?.includes(activeGenre)),
  [stories, activeGenre]);

  const getCover = (story) =>
    story?.coverImage ||
    story?.cover ||
    story?.pages?.find(p => p.type === 'image')?.src ||
    "https://via.placeholder.com/300x400/111111/00fff2?text=No+Cover";

  const handleSelectStory = (story) => {
    if (!story) return;
    setSelectedStory(story);
    setView(story?.folder ? "reader" : "story");
  };

  const heroStory = filteredStories[0] || classics[0] || null;

  return (
    <div style={{
      background: `radial-gradient(circle at 50% 0%, ${neonColor}15, #050505 80%)`,
      minHeight: '100vh',
      padding: '0 12px 100px 12px',
      color: 'white',
      fontFamily: 'sans-serif',
      overflowX: 'hidden'
    }}>
      
      <Header toggleBurger={toggleBurger} setView={setView} notifCount={3} />

      <div style={{ marginTop: '10px' }}>
        <Tabs setView={setView} />
      </div>

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

      <section style={{ marginTop: '25px' }}>
        <h3 style={{ fontSize: '14px', color: neonColor, textTransform: 'uppercase', marginBottom: '12px', paddingLeft: '5px' }}>
          ✨ Recommandations
        </h3>
        {filteredStories.length > 0 ? (
          <TrendingGrid 
            stories={filteredStories.slice(1, 7)} 
            setSelectedStory={handleSelectStory} 
            setView={setView} 
            getCover={getCover}
            neonColor={neonColor} 
          />
        ) : (
          <p style={{ fontSize: '10px', color: '#666', textAlign: 'center' }}>
            Chargement des histoires...
          </p>
        )}
      </section>

      {classics.length > 0 && (
        <section style={{ marginTop: '30px' }}>
          <h3 style={{ fontSize: '14px', color: '#fff', textTransform: 'uppercase', marginBottom: '12px', paddingLeft: '5px' }}>
            📚 Classiques
          </h3>
          <TrendingGrid 
            stories={classics} 
            setSelectedStory={handleSelectStory} 
            setView={setView} 
            getCover={getCover}
            neonColor={neonColor} 
          />
        </section>
      )}
     
           {/* --- INSERER ICI --- */}
      
      {/* 1. LE TOP HORIZONTAL */}
      <Section title="🔥 TOP LECTURES" color="#FFD700">
        <TrendingScroll 
          setView={setView} 
          setSelectedStory={setSelectedStory} 
        />
      </Section>

      {/* 2. LES EXCLUSIVITÉS VERTICALES */}
      <Section title="✨ EXCLUSIVITÉS COMICCRAFTE" color={neonColor}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '0 5px' }}>
          {COMICCRAFTE_STORIES.map((story) => (
            <div key={story.id} style={s.verticalCard} onClick={() => handleSelectStory(story)}>
              <img src={story.coverImage} style={s.vThumb} alt={story.title} />
              <div style={s.vDetails}>
                <div style={s.vHeader}>
                  <span style={{...s.vGenre, color: neonColor}}>{story.genres?.[0]}</span>
                  <span style={s.vStatus}>ORIGINAL</span>
                </div>
                <div style={s.vTitle}>{story.title}</div>
                <div style={s.vDesc}>Nouveauté ComicCrafte Studio</div>
                <div style={s.vFooter}>
                  <span>❤️ {story.likesCount || 0}</span>
                  <span style={{ color: neonColor, fontWeight: 'bold' }}>S'ABONNER</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* --- FIN DE L'INSERTION --- */}
      
      <TopCreator 
        creators={creators} 
        setView={setView} 
        setSelectedUser={setSelectedUser}
        neonColor={neonColor} 
      />

      <section style={{ marginTop: '30px' }}>
        <h3 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>🆕 Nouveautés</h3>
        {filteredStories.slice(7, 10).map(story => (
          <NewStory 
            key={story.id} 
            story={story} 
            setSelectedStory={handleSelectStory} 
            setView={setView} 
            getCover={getCover}
            neonColor={neonColor} 
          />
        ))}
      </section>
      {/* 6. NEWS (Cartes NewsCard) */}
      <section style={{ marginTop: '30px' }}>
        <h3 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>📰 News</h3>
        {filteredStories.slice(10, 13).map(news => (
          <NewsCard 
            key={news.id} 
            news={news} 
            setView={setView} 
            neonColor={neonColor} 
          />
        ))}
      </section>

      {/* Style pour la scrollbar */}
      <style>
        {`
          ::-webkit-scrollbar { width: 0px; background: transparent; }
          div { scrollbar-width: none; }
        `}
      </style>

    </div>
  );
}
