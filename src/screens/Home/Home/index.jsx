import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FABLES_DATABASE } from "../../../data/fablesDatabase";
import { PUBLIC_STORIES } from "../../../data/publicStories"; 
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "../../../firebase/index.js";

// COMPONENTS
import Header from "../components/Header";
import Tabs from "../components/Tabs";
import HeroSection from "../components/HeroSection";
import TrendingGrid from "../components/TrendingGrid";
import TopCreator from "../components/TopCreator";
import WebtoonSection from "../components/WebtoonSection";

import ComicCrafteVertical from "../components/ComicCrafteVertical";
import TrendingScroll from "../components/TrendingScroll";
import NewStory from "../components/NewStory";
import NewsCard from "../components/NewsCard";
import PublicStoriesSection from "../components/PublicStoriesSection";
import { StorySpotlight } from "../components/StorySpotlight";

import GenreScroll from "../components/GenreScroll";
import MythologySection from "../components/MythologySection";
import VerticalSection from "../components/VerticalSection";
import SaisonScroll from "../components/SaisonScroll";
import { FablesGrid } from "../components/FablesGrid"; // Vérifie bien le chemin du fichier



// CONFIG
const GENRES = ["Tous","Action","Horreur","Romance","Aventure","Sci-Fi","Drame","Comédie","Fantastique"];
const NEON_COLORS = ["#ff003c","#00f7ff","#ff00ff","#39ff14","#ffd300","#8f00ff"];

// SECTION WRAPPER
const Section = ({ title, children, color, showVoirTout, onVoirTout }) => (
  <section style={{ marginTop: 25, padding: "0 6px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
      <h3 style={{
        fontSize: 12,
        fontWeight: "900",
        textTransform: "uppercase",
        color: color || "#fff",
        letterSpacing: "1px",
        borderLeft: `3px solid ${color || "#fff"}`,
        paddingLeft: "8px"
      }}>
        {title}
      </h3>
      {showVoirTout && (
        <span onClick={onVoirTout} style={{ fontSize: "10px", color: "#777", fontWeight: "600", cursor: "pointer" }}>
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

  const neonColor = useMemo(
    () => NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
    []
  );

  // ================= DATA =================
  useEffect(() => {
    const q = query(collection(db, "stories"), orderBy("viewsCount", "desc"), limit(40));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setStories(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "publish"), orderBy("createdAt", "desc"), limit(15));
    const unsub = onSnapshot(q, (snap) => {
      setPublicStories(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // ================= NAVIGATION =================
  const handleSelectStory = useCallback((story) => {
    try {
      if (!story || typeof story !== "object") return;

      const chapters = Array.isArray(story.chapters) ? story.chapters : [];
      const directPages = Array.isArray(story.pages) ? story.pages : [];
      const hasFolder = !!story.folder;

      const resolvedPages =
        directPages.length > 0
          ? directPages
          : (chapters.length > 0 && Array.isArray(chapters[0]?.pages)
              ? chapters[0].pages
              : []);

      const normalizedStory = {
        ...story,
        cover: story.coverImage || story.cover || "",
        coverImage: story.coverImage || story.cover || "",
        pages: resolvedPages
      };

      const hasContent =
        resolvedPages.length > 0 ||
        chapters.length > 0 ||
        hasFolder;

      if (typeof setSelectedStory === "function") {
        setSelectedStory(normalizedStory);
      }

      if (typeof setView === "function") {
        setView(hasContent ? "reader" : "story");
      }

      if (typeof window !== "undefined" && window.scrollTo) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

    } catch (err) {
      console.error("handleSelectStory error:", err);
    }
  }, [setSelectedStory, setView]);

  // ================= FILTER =================
  const filteredStories = useMemo(() => {
    try {
      if (!Array.isArray(stories)) return [];

      if (activeGenre === "Tous") return stories;

      return stories.filter((s) => {
        if (!s || typeof s !== "object") return false;
        const genres = Array.isArray(s.genres) ? s.genres : [];
        return genres.includes(activeGenre);
      });

    } catch {
      return [];
    }
  }, [stories, activeGenre]);

  // ================= HERO =================
  const heroStory = useMemo(() => {
    try {
      if (filteredStories.length > 0) return filteredStories[0];
      if (publicStories.length > 0) return publicStories[0];
      return null;
    } catch {
      return null;
    }
  }, [filteredStories, publicStories]);

  // ================= RENDER =================
  return (
    <div
      style={{
        background: "#050505",
        backgroundImage: `radial-gradient(circle at 50% -10%, ${neonColor}20, transparent 70%)`,
        minHeight: "100vh",
        padding: "0 10px 80px",
        color: "white"
      }}
    >
      {/* HEADER */}
      <Header toggleBurger={toggleBurger} setView={setView} />
      <Tabs setView={setView} />

      {/* HERO */}
      {heroStory && (
        <div style={{ marginTop: 16 }}>
          <HeroSection
            stories={[heroStory]}  // ✅ ICI : Ajoute le 's' et les crochets [ ]
            items={publicStories}   // ✅ ICI : Ajoute les items pour le style "FLASH!"
            setSelectedStory={handleSelectStory}
            setView={setView}
          />
        </div>
      )}

{/* SECTION 2 : ACTION (Avec bouton programme automatique) */}
<WebtoonSection 
  title="Lancées récemment" 
  filterTag="Action" 
  setView={setView} 
  setSelectedStory={handleSelectStory} 
/>
      {/* TRENDING SCROLL */}
      <Section title="🔥 Tendances" color="#FFD700" showVoirTout onVoirTout={() => setView("series")}>
        <TrendingScroll
          setView={setView}
          setSelectedStory={handleSelectStory}
          neonColor="#00f7ff"
        />
      </Section>

      {/* TOP CREATOR */}
      <TopCreator
        creators={[{
          id: 1,
          username: "Jordan M. G.",
          photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky"
        }]}
        setView={setView}
        setSelectedUser={setSelectedUser}
        neonColor={neonColor}
      />


{/* REMPLACE TOUT CE BLOC DANS TON INDEX */}
<FablesGrid
  fables={FABLES_DATABASE} // On utilise ta base de données fables
  setSelectedStory={handleSelectStory}
  setView={setView}
  neonColor="#FFD700"
  limit={10} 
/>
      {/* NEW */}
      <Section title="🆕 Récemment Ajoutés">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filteredStories.slice(10, 16).map((s) => (
            <NewStory
              key={s.id}
              story={s}
              setSelectedStory={handleSelectStory}
              setView={setView}
              neonColor={neonColor}
            />
          ))}
        </div>
      </Section>
      
            {/* GENRES */}
      <div style={{ marginTop: 12 }}>
        <GenreScroll
          genres={GENRES}
          activeGenre={activeGenre}
          setActiveGenre={setActiveGenre}
          neonColor={neonColor}
        />
      </div>
      {/* COMMUNITY */}
      <PublicStoriesSection
        setSelectedStory={handleSelectStory}
        setView={setView}
        neonColor={neonColor}
      />
            {/* MYTHOLOGY */}
      <MythologySection
        setSelectedStory={handleSelectStory}
        setView={setView}
      />
      {/* REMPLACE TOUT CE BLOC DANS TON INDEX */}
<FablesGrid
  fables={FABLES_DATABASE} // On utilise ta base de données fables
  setSelectedStory={handleSelectStory}
  setView={setView}
  neonColor="#FFD700"
  limit={10} 
/>
      {/* GRID */}
      <Section title="🎯 Pour Vous" color={neonColor}>
        {loading ? (
          <div style={{ height: 80 }} />
        ) : (
          <TrendingGrid
            stories={filteredStories.slice(1, 10)}
            setSelectedStory={handleSelectStory}
            setView={setView}
            neonColor={neonColor}
          />
        )}
      </Section>
      
          {/* EXCLUSIVES */}
      <Section title="✨ Exclusivités Studio" color={neonColor}>
        <ComicCrafteVertical
          setView={setView}
          setSelectedStory={handleSelectStory}
          neonColor={neonColor}
        />
      </Section>
      <StorySpotlight 
  label="NOUVELLE SPÉCIALE"
  story={PUBLIC_STORIES[0]} // Prend la première histoire
  setSelectedStory={setSelectedStory}
  setView={setView}
/>

      {/* NEWS */}
      <Section title="📰 Actu Studio" color={neonColor}>
        <NewsCard
          news={stories[0] || {}}
          setView={setView}
          neonColor={neonColor}
        />
      </Section>

      <div style={{ height: 80 }} />
    </div>
  );
}