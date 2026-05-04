import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FABLES_DATABASE } from "../../../data/fablesDatabase";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "../../../firebase/index.js";

// ✅ COMPOSANTS ÉPURÉS
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
import GenreScroll from "../components/GenreScroll";
import MythologySection from "../components/MythologySection";

// ✅ LE NOUVEAU COMPOSANT (Vérifie bien le chemin du fichier)
import VerticalSection from "../components/VerticalSection"; 

// ================= CONFIGURATION =================
const GENRES = ["Tous","Action","Horreur","Romance","Aventure","Sci-Fi","Drame","Comédie","Fantastique"];
const NEON_COLORS = ["#ff003c","#00f7ff","#ff00ff","#39ff14","#ffd300","#8f00ff"];

const Section = ({ title, children, color, showVoirTout, onVoirTout }) => (
  <section style={{ marginTop: 30, padding: "0 4px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
      <h3 style={{ 
        fontSize: 13, 
        fontWeight: "900", 
        textTransform: "uppercase", 
        color: color || "#fff",
        letterSpacing: "1px",
        borderLeft: `3px solid ${color || "#fff"}`,
        paddingLeft: "10px"
      }}>
        {title}
      </h3>
      {showVoirTout && (
        <span onClick={onVoirTout} style={{ fontSize: "10px", color: "#888", fontWeight: "600", cursor: "pointer" }}>
          VOIR TOUT
        </span>
      )}
    </div>
    {children}
  </section>
);

export default function Home({ setView, setSelectedStory, setSelectedUser, toggleBurger }) {
  const [stories, setStories] = useState([]);
  const [publicStories, setPublicStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState("Tous");

  const neonColor = useMemo(() => NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)], []);

  // 1. Chargement des histoires (Global)
  useEffect(() => {
    const q = query(collection(db, "stories"), orderBy("viewsCount", "desc"), limit(40));
    const unsub = onSnapshot(q, (snap) => {
      setStories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => { console.error(err); setLoading(false); });
    return () => unsub();
  }, []);

  // 2. Chargement Communauté
  useEffect(() => {
    const q = query(collection(db, "publish"), orderBy("createdAt", "desc"), limit(15));
    const unsub = onSnapshot(q, (snap) => {
      setPublicStories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleSelectStory = useCallback((story) => {
    if (!story) return;
    setSelectedStory(story);
    // Navigation intelligente : Si fables ou dossier -> Reader, sinon Page Story
    setView((story.chapters || story.folder) ? "reader" : "story");
    window.scrollTo(0, 0);
  }, [setSelectedStory, setView]);

  const filteredStories = useMemo(() => {
    return activeGenre === "Tous" ? stories : stories.filter(s => s.genres?.includes(activeGenre));
  }, [stories, activeGenre]);

  const heroStory = filteredStories[0] || publicStories[0];

  return (
    <div style={{
        background: "#050505",
        backgroundImage: `radial-gradient(circle at 50% -10%, ${neonColor}20, transparent 70%)`,
        minHeight: "100vh",
        padding: "0 12px 80px 12px",
        color: "white"
    }}>
      <Header toggleBurger={toggleBurger} setView={setView} />
      <Tabs setView={setView} />

      <div style={{ marginTop: 15 }}>
        <GenreScroll genres={GENRES} activeGenre={activeGenre} setActiveGenre={setActiveGenre} neonColor={neonColor} />
      </div>

      {heroStory && (
        <div style={{ marginTop: 20 }}>
          <HeroSection story={heroStory} setSelectedStory={handleSelectStory} setView={setView} />
        </div>
      )}

      <Section title="🔥 Tendances" color="#FFD700" showVoirTout onVoirTout={() => setView("series")}>
        <TrendingScroll setView={setView} setSelectedStory={handleSelectStory} neonColor="#00f7ff" />
      </Section>

      <TopCreator 
        creators={[{id:1, username:"Jordan M. G.", photoURL:"https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky"}]} 
        setView={setView} setSelectedUser={setSelectedUser} neonColor={neonColor} 
      />

      {/* 📖 SECTION FABLES & SAGESSE */}
      <VerticalSection 
        title="📖 Fables & Sagesse" 
        data={FABLES_DATABASE} 
        setSelectedStory={handleSelectStory} 
        setView={setView} 
        neonColor="#FFD700"
      />

      <Section title="✨ Exclusivités Studio" color={neonColor}>
        <ComicCrafteVertical setView={setView} setSelectedStory={handleSelectStory} neonColor={neonColor} />
      </Section>

      <MythologySection setSelectedStory={handleSelectStory} setView={setView} />

      <Section title="🎯 Pour Vous" color={neonColor}>
        {loading ? (
          <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>...</div>
        ) : (
          <TrendingGrid 
            stories={filteredStories.slice(1, 10)} 
            setSelectedStory={handleSelectStory} 
            setView={setView} 
            neonColor={neonColor} 
          />
        )}
      </Section>

      <PublicStoriesSection setSelectedStory={handleSelectStory} setView={setView} neonColor={neonColor} />

      <Section title="🆕 Récemment Ajoutés">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredStories.slice(10, 16).map((s) => (
            <NewStory key={s.id} story={s} setSelectedStory={handleSelectStory} setView={setView} neonColor={neonColor} />
          ))}
        </div>
      </Section>

      <Section title="📰 Actu Studio" color={neonColor}>
         <NewsCard news={stories[0] || {}} setView={setView} neonColor={neonColor} />
      </Section>

      <div style={{ height: 80 }} />
    </div>
  );
}
