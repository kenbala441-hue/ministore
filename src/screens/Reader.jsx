import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Settings, ChevronLeft, ChevronRight, X, Bookmark, Download, 
  Coffee, Eye, BookOpen, Share2 
} from "lucide-react";

import { COMICCRAFTE_STORIES as storiesGeneral } from "../data/COMICCRAFTE_DATA";
import { COMICCRAFTE_STORIES as storiesAction } from "../data/Action"; 
import { SettingsMenu } from "./components/SettingsMenu";

export default function Reader({ story, setView }) {
  // ================== ÉTATS (STATE) ==================
  const [chapterIndex, setChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState("dark");
  const [showSettings, setShowSettings] = useState(false);
  const [isWebtoonMode, setIsWebtoonMode] = useState(false);
  const [autoScroll, setAutoScroll] = useState(false);
  const [showChapters, setShowChapters] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
const scrollRef = useRef(null);
  // ================== THÈMES (CONFIG) ==================
  const themes = {
    dark: { bg: "#0a0a0c", paper: "#121214", text: "#e2e8f0", accent: "#00f7ff", border: "#1f2937", shadow: "rgba(0,0,0,0.5)" },
    light: { bg: "#f8fafc", paper: "#ffffff", text: "#0f172a", accent: "#0ea5e9", border: "#e2e8f0", shadow: "rgba(0,0,0,0.1)" },
    sepia: { bg: "#f4f1ea", paper: "#fdfbf7", text: "#433422", accent: "#92400e", border: "#e7e5e4", shadow: "rgba(67,52,34,0.1)" },
    neon: { bg: "#050505", paper: "#000000", text: "#00fff2", accent: "#ff00ff", border: "#333", shadow: "rgba(255,0,255,0.2)" }
  };
  const currentTheme = themes[theme];

// ================== GESTION DES DONNÉES (PRO) ==================

// Sécurité de base
const safeStory = story || {};

// Vérifie si offline
const isOfflineStory = Boolean(safeStory?.isOffline);

// Fusion intelligente des sources
const storyData = useMemo(() => {
  if (!safeStory?.id) return {};

  if (isOfflineStory) return safeStory;

  const allStories = [...(storiesAction || []), ...(storiesGeneral || [])];

  return allStories.find(s => s.id === safeStory.id) || safeStory;

}, [safeStory, isOfflineStory]);

// Normalisation des chapitres (ULTRA IMPORTANT)
const chapters = useMemo(() => {
  if (!storyData) return [];

  // Si déjà format chapitres
  if (Array.isArray(storyData.chapters)) {
    return storyData.chapters;
  }

  // Si format content (ancien)
  if (Array.isArray(storyData.content)) {
    return storyData.content.map((item, index) => ({
      title: item.title || `Chapitre ${index + 1}`,
      pages: item.pages || item || []
    }));
  }

  return [];

}, [storyData]);

// Sécurisation index (évite crash)
const safeChapterIndex = Math.min(
  Math.max(chapterIndex, 0),
  chapters.length - 1
);

// Chapitre actuel sécurisé
const currentChapter = chapters[safeChapterIndex] || {
  title: "Chapitre 1",
  pages: []
};

// Pages toujours propre
const pages = Array.isArray(currentChapter.pages)
  ? currentChapter.pages
  : [];

// ================== PERSISTENCE (RÉCENTS & FAVORIS) ==================

useEffect(() => {
  if (!storyData?.id) return;

  let recent = [];
  try {
    recent = JSON.parse(localStorage.getItem("comicrafte_recent")) || [];
  } catch {
    recent = [];
  }

  const newEntry = {
    id: storyData.id,
    title: storyData.title || "Sans titre",
    image: storyData.cover || storyData.img || "",
    chapter: `Ch. ${chapterIndex + 1}`,
    type: storyData.type || "Manga",
    timestamp: Date.now()
  };

  const updated = [
    newEntry,
    ...recent.filter(r => r.id !== storyData.id)
  ].slice(0, 20);

  try {
    localStorage.setItem("comicrafte_recent", JSON.stringify(updated));
  } catch (e) {
    console.error("Erreur stockage récents:", e);
  }

}, [storyData?.id, chapterIndex]);


// ================== SYNC FAVORIS ==================
useEffect(() => {
  if (!storyData?.id) return;

  let favorites = [];
  try {
    favorites = JSON.parse(localStorage.getItem("comicrafte_favorites")) || [];
  } catch {
    favorites = [];
  }

  setIsSaved(favorites.some(f => f.id === storyData.id));

}, [storyData?.id]);


// ================== TOGGLE FAVORIS ==================
const handleToggleSave = () => {
  if (!storyData?.id) return;

  let favorites = [];
  try {
    favorites = JSON.parse(localStorage.getItem("comicrafte_favorites")) || [];
  } catch {
    favorites = [];
  }

  const exists = favorites.some(f => f.id === storyData.id);

  let updated;

  if (exists) {
    updated = favorites.filter(f => f.id !== storyData.id);
  } else {
    updated = [
      {
        id: storyData.id,
        title: storyData.title || "Sans titre",
        image: storyData.cover || storyData.img || "",
        type: storyData.type || "Manga",
        addedAt: Date.now()
      },
      ...favorites
    ];
  }

  try {
    localStorage.setItem("comicrafte_favorites", JSON.stringify(updated));
  } catch (e) {
    console.error("Erreur stockage favoris:", e);
  }

  setIsSaved(!exists);
};

// ================== DOWNLOAD (OFFLINE PRO) ==================
const saveForOffline = () => {
  if (!storyData?.id) return;

  const KEY = "comicrafte_downloads_v2";

  let downloads = [];
  try {
    downloads = JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    downloads = [];
  }

  // 🔒 Vérifie si déjà téléchargé
  const exists = downloads.some(item => item.id === storyData.id);
  if (exists) {
    alert("📥 Déjà téléchargé.");
    return;
  }

  // 🧹 Nettoyage + normalisation des chapitres
  const cleanChapters = (chapters || []).map((ch, index) => ({
    title: ch.title || `Chapitre ${index + 1}`,
    pages: (ch.pages || []).map(p => {
      if (typeof p === "string") return p;
      if (p?.content) return p.content;
      return "";
    }).filter(Boolean) // supprime vide
  }));

  // 📦 Objet final optimisé
  const newDownload = {
    id: storyData.id,
    title: storyData.title || "Sans titre",
    image: storyData.cover || storyData.img || "",
    type: storyData.type || "Manga",
    isOffline: true,
    downloadedAt: Date.now(),
    chapters: cleanChapters
  };

  const updated = [newDownload, ...downloads];

  try {
    localStorage.setItem(KEY, JSON.stringify(updated));
    alert("✅ Téléchargé pour lecture hors ligne !");
  } catch (e) {
    console.error("Erreur stockage offline:", e);
    alert("❌ Erreur de stockage.");
  }
};
// ================== LOGIQUE DE NAVIGATION (PRO) ==================

// 🔁 Auto-scroll fluide avec requestAnimationFrame (meilleur que setInterval)
useEffect(() => {
  let animationFrame;

  const scrollStep = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop += 0.5; // vitesse ultra fluide
      animationFrame = requestAnimationFrame(scrollStep);
    }
  };

  if (autoScroll) {
    animationFrame = requestAnimationFrame(scrollStep);
  }

  return () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
  };
}, [autoScroll]);


// 🔝 Scroll automatique en haut quand on change de chapitre
useEffect(() => {
  if (scrollRef.current) {
    scrollRef.current.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
}, [chapterIndex]);


// 🧠 Rendu intelligent (optimisé + sécurisé)
const renderPageContent = (contentArray = []) => {
  return contentArray.map((item, i) => {
    
    // 🖼️ IMAGE (webtoon style optimisé)
    if (typeof item === "string" && (item.startsWith("http") || item.startsWith("data:image"))) {
      return (
        <motion.img
          key={`img-${i}`}
          src={item}
          alt={`page-${i}`}
          loading="lazy" // 🔥 optimisation performance
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            width: "100%",
            display: "block",
            marginBottom: isWebtoonMode ? "0" : "20px",
            borderRadius: isWebtoonMode ? "0" : "10px",
            objectFit: "cover"
          }}
        />
      );
    }

    // 📝 TEXTE (lecture optimisée)
    return (
      <p
        key={`txt-${i}`}
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: "1.9",
          marginBottom: "22px",
          textAlign: "justify",
          padding: isWebtoonMode ? "0 18px" : "0",
          letterSpacing: "0.2px",
          wordBreak: "break-word"
        }}
      >
        {item || ""}
      </p>
    );
  });
};
  // ================== RENDU UI (JSX) ==================
  return (
    <div style={{ ...s.container, background: currentTheme.bg, color: currentTheme.text }}>
      
      {/* --- HEADER --- */}
      <header style={{ ...s.header, background: currentTheme.bg, borderBottom: `1px solid ${currentTheme.border}` }}>
        <button onClick={() => setView("home")} style={s.iconBtn}><ArrowLeft size={22} /></button>
        <div style={s.headerTitle} onClick={() => setShowChapters(true)}>
          <span style={s.storyTitle}>{storyData.title} <ChevronLeft size={12} style={{transform: "rotate(-90deg)"}}/></span>
          <span style={s.chTitle}>{currentChapter.title}</span>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={saveForOffline} style={s.iconBtn}><Download size={20} /></button>
          <button onClick={handleToggleSave} style={{ ...s.iconBtn, color: isSaved ? currentTheme.accent : "inherit" }}>
            <Bookmark size={20} fill={isSaved ? currentTheme.accent : "none"} />
          </button>
          <button onClick={() => setShowSettings(true)} style={s.iconBtn}><Settings size={20} /></button>
        </div>
      </header>

      {/* --- ZONE DE LECTURE --- */}
      <main ref={scrollRef} style={s.main}>
        <div style={{ 
          ...s.contentWrapper,
          width: isWebtoonMode ? "100%" : "92%",
          maxWidth: isWebtoonMode ? "100%" : "800px",
          background: isWebtoonMode ? "transparent" : currentTheme.paper,
          padding: isWebtoonMode ? "0" : "40px 25px",
          boxShadow: isWebtoonMode ? "none" : `0 10px 40px ${currentTheme.shadow}`
        }}>
          {renderPageContent(pages)}

          {chapterIndex < chapters.length - 1 ? (
            <button 
              onClick={() => { setChapterIndex(prev => prev + 1); scrollRef.current.scrollTo(0, 0); }}
              style={{ ...s.nextBtn, background: currentTheme.accent }}
            >
              Chapitre Suivant <ChevronRight size={20} />
            </button>
          ) : (
            <div style={s.endMessage}>✨ Fin de l'aventure pour l'instant ✨</div>
          )}
        </div>
      </main>

      {/* --- LE NOUVEAU MENU DES RÉGLAGES (Ultra complet) --- */}
      <SettingsMenu 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        settings={{ 
          theme, 
          fontSize, 
          isWebtoonMode, 
          autoScroll, 
        }} 
        setSettings={{ 
          setTheme, 
          setFontSize, 
          setIsWebtoonMode, 
          setAutoScroll, 
        }} 
      />

      {/* --- LE DRAWER DES CHAPITRES (Pour changer d'histoire facilement) --- */}
      <AnimatePresence>
        {showChapters && (
          <>
            {/* Fond sombre cliquable pour fermer */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowChapters(false)} 
              style={s.drawerBackdrop} 
            />
            
            {/* Panneau latéral des chapitres */}
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }} 
              transition={{ type: "spring", damping: 25 }} 
              style={{ ...s.drawer, background: currentTheme.paper }}
            >
              <div style={{ ...s.drawerHeader, borderBottom: `1px solid ${currentTheme.border}` }}>
                <h3 style={{ margin: 0 }}>Chapitres</h3>
                <X onClick={() => setShowChapters(false)} style={s.pointer} />
              </div>

              <div style={s.drawerList}>
                {chapters.map((ch, i) => (
                  <motion.div 
                    whileTap={{ scale: 0.98 }}
                    key={i} 
                    onClick={() => { 
                      setChapterIndex(i); 
                      setShowChapters(false); 
                      scrollRef.current.scrollTo(0, 0); 
                    }}
                    style={{ 
                      ...s.chapterItem, 
                      background: i === chapterIndex ? currentTheme.accent + "22" : "transparent", 
                      color: i === chapterIndex ? currentTheme.accent : "inherit" 
                    }}
                  >
                    <span style={s.chNum}>{i + 1}</span>
                    <span style={s.chLabel}>{ch.title || `Chapitre ${i + 1}`}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
const s = {
  container: { height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "'Inter', sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", zIndex: 100 },
  headerTitle: { textAlign: "center", cursor: "pointer" },
  storyTitle: { fontWeight: "900", fontSize: "11px", display: "flex", alignItems: "center", gap: 5, justifyContent: "center", textTransform: "uppercase" },
  chTitle: { fontSize: "13px", fontWeight: "500", opacity: 0.7 },
  main: { flex: 1, overflowY: "auto", scrollBehavior: "smooth" },
  contentWrapper: { margin: "0 auto", transition: "all 0.4s ease" },
  iconBtn: { background: "none", border: "none", color: "inherit", cursor: "pointer", padding: "6px", display: "flex", alignItems: "center" },
  nextBtn: { width: "calc(100% - 40px)", margin: "40px 20px 20px", padding: "18px", borderRadius: "16px", border: "none", fontWeight: "900", cursor: "pointer" },
  endMessage: { textAlign: "center", padding: "60px 20px", opacity: 0.4 },
  drawerBackdrop: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.7)", zIndex: 250 },
  drawer: { position: "fixed", right: 0, top: 0, width: "85%", maxWidth: "350px", height: "100%", zIndex: 260, display: "flex", flexDirection: "column", boxShadow: "-10px 0 50px rgba(0,0,0,0.8)" },
  drawerHeader: { padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  drawerList: { flex: 1, overflowY: "auto", padding: "10px" },
  chapterItem: { display: "flex", alignItems: "center", gap: "15px", padding: "15px", borderRadius: "12px", marginBottom: "8px", cursor: "pointer", transition: "0.2s" },
  chNum: { fontSize: "18px", fontWeight: "900", opacity: 0.2 },
  chLabel: { fontWeight: "600", fontSize: "15px" },
  pointer: { cursor: "pointer" }
};
