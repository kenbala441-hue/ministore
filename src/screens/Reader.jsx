import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Settings, ChevronLeft, ChevronRight, 
  Layout, Play, X, Headphones, 
  Sun, Moon, Coffee, Zap, MousePointer2, Bookmark, Download
} from "lucide-react";
import { COMICCRAFTE_STORIES } from "../data/COMICCRAFTE_DATA";

export default function Reader({ story, setView }) {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState("dark");
  const [showSettings, setShowSettings] = useState(false);
  const [isWebtoonMode, setIsWebtoonMode] = useState(false);
  const [autoScroll, setAutoScroll] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const scrollRef = useRef(null);
  const autoScrollInterval = useRef(null);

  const themes = {
    dark: { bg: "#0a0a0c", paper: "#121214", text: "#e2e8f0", accent: "#00f7ff", border: "#1f2937" },
    light: { bg: "#f8fafc", paper: "#ffffff", text: "#0f172a", accent: "#0ea5e9", border: "#e2e8f0" },
    sepia: { bg: "#f4f1ea", paper: "#fdfbf7", text: "#433422", accent: "#92400e", border: "#e7e5e4" },
    neon: { bg: "#050505", paper: "#000000", text: "#00fff2", accent: "#ff00ff", border: "#333" }
  };

    const currentTheme = themes[theme];
  
  // 1. On vérifie si l'histoire vient des téléchargements (hors-ligne)
  const isOfflineStory = story?.isOffline;

  // 2. On récupère les infos (soit de la DATA locale, soit de l'objet téléchargé)
  const storyData = useMemo(() => {
    if (isOfflineStory) return story; 
    return COMICCRAFTE_STORIES.find((s) => s.id === story?.id) || story || {};
  }, [story, isOfflineStory]);

  // 3. On récupère les chapitres (supporte 'content' pour le offline et 'chapters' pour le online)
  const chapters = useMemo(() => {
    return storyData?.content || storyData?.chapters || [];
  }, [storyData]);

  // 4. On définit le chapitre et les pages actuelles
  const currentChapter = chapters[chapterIndex] || { pages: [] };
  const pages = currentChapter.pages || [];


  // --- 1. SYSTÈME RÉCENTS (Correction pour utiliser les bonnes clés) ---
  useEffect(() => {
    if (storyData.id) {
      const recent = JSON.parse(localStorage.getItem("comicrafte_recent")) || [];
      const filtered = recent.filter(r => r.id !== storyData.id);
      const updated = [{ 
        id: storyData.id, 
        title: storyData.title, 
        image: storyData.cover || storyData.img, // Utilisation de 'image' pour correspondre à MySeries
        chapter: `Ch. ${chapterIndex + 1}`,
        type: storyData.type || "Manga",
        timestamp: new Date().getTime() 
      }, ...filtered].slice(0, 20);
      localStorage.setItem("comicrafte_recent", JSON.stringify(updated));
    }
  }, [storyData.id, chapterIndex]);

  // --- 2. VÉRIFICATION ÉTAT FAVORIS ---
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("comicrafte_favorites")) || [];
    const found = favorites.find(f => f.id === storyData.id);
    setIsSaved(!!found);
  }, [storyData.id]);

  // --- 3. FONCTION TOGGLE FAVORIS ---
  const handleToggleSave = () => {
    const favorites = JSON.parse(localStorage.getItem("comicrafte_favorites")) || [];
    const isAlreadyFavorite = favorites.find(f => f.id === storyData.id);
    let newFavs;

    if (isAlreadyFavorite) {
      newFavs = favorites.filter(f => f.id !== storyData.id);
      setIsSaved(false);
    } else {
      newFavs = [...favorites, { 
        id: storyData.id, 
        title: storyData.title, 
        image: storyData.cover || storyData.img,
        type: storyData.type || "Manga",
        savedAt: new Date() 
      }];
      setIsSaved(true);
    }
    localStorage.setItem("comicrafte_favorites", JSON.stringify(newFavs));
  };

// --- 4. FONCTION HORS-LIGNE (VERSION PRO) ---
const saveForOffline = () => {
  try {
    const STORAGE_KEY = "comicrafte_downloads_v2";

    // Récupération sécurisée
    let downloads = [];
    try {
      downloads = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      downloads = [];
    }

    // Vérifier si déjà téléchargé
    const alreadyExists = downloads.some(item => item.id === storyData.id);

    if (alreadyExists) {
      alert("📥 Déjà téléchargé.");
      return;
    }

    // Nettoyage du contenu (évite bug React)
    const cleanChapters = (chapters || []).map(ch => ({
      ...ch,
      pages: (ch.pages || []).map(p => {
        if (typeof p === "string") return p;
        return p?.content || "";
      })
    }));

    const newDownload = {
      id: storyData.id,
      title: storyData.title || "Sans titre",
      image: storyData.cover || storyData.img || "",
      type: storyData.type || "Story",
      
      // 🔥 META
      isOffline: true,
      version: 2,
      size: JSON.stringify(cleanChapters).length,
      downloadedAt: Date.now(),

      // 🔥 CONTENU
      chapters: cleanChapters
    };

    const updatedDownloads = [...downloads, newDownload];

    // ⚠️ Vérification taille (évite crash mobile)
    const totalSize = JSON.stringify(updatedDownloads).length;
    if (totalSize > 4_500_000) {
      alert("⚠️ Stockage plein, supprime des téléchargements.");
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDownloads));

    // 🔥 UPDATE UI instantané
    window.dispatchEvent(new StorageEvent("storage", {
      key: STORAGE_KEY
    }));

    alert("✅ Disponible hors-ligne !");
    
  } catch (error) {
    console.error("Erreur téléchargement:", error);
    alert("❌ Échec du téléchargement.");
  }
};

  // --- LOGIQUE AUTO-SCROLL ---
  useEffect(() => {
    if (autoScroll) {
      autoScrollInterval.current = setInterval(() => {
        if (scrollRef.current) scrollRef.current.scrollTop += 1;
      }, 30);
    } else {
      clearInterval(autoScrollInterval.current);
    }
    return () => clearInterval(autoScrollInterval.current);
  }, [autoScroll]);

  const renderPageContent = (contentArray) => {
    return contentArray.map((item, i) => {
      if (item.startsWith('http')) {
        return (
          <img key={i} src={item} alt="" style={{ 
            width: "100%", display: "block",
            marginBottom: isWebtoonMode ? "0" : "20px",
            borderRadius: isWebtoonMode ? "0" : "8px"
          }} />
        );
      }
      return (
        <p key={i} style={{ 
          fontSize: `${fontSize}px`, lineHeight: "1.8", marginBottom: "20px", 
          textAlign: "justify", padding: isWebtoonMode ? "0 15px" : "0" 
        }}>{item}</p>
      );
    });
  };

  return (
    <div style={{ ...s.container, background: currentTheme.bg, color: currentTheme.text }}>
      
      <header style={{ ...s.header, background: currentTheme.bg, borderBottom: `1px solid ${currentTheme.border}` }}>
        <button onClick={() => setView("home")} style={s.iconBtn}><ArrowLeft size={20} /></button>
        <div style={s.headerTitle}>
          <span style={s.storyTitle}>{storyData.title}</span>
          <span style={s.chTitle}>{currentChapter.title}</span>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={saveForOffline} style={s.iconBtn}><Download size={20} /></button>
          <button onClick={handleToggleSave} style={{ ...s.iconBtn, color: isSaved ? currentTheme.accent : "inherit" }}>
            <Bookmark size={20} fill={isSaved ? currentTheme.accent : "none"} />
          </button>
          <button onClick={() => setShowSettings(true)} style={s.iconBtn}><Settings size={20} /></button>
        </div>
      </header>

      <main ref={scrollRef} style={s.main}>
        <div style={{ 
          ...s.contentWrapper,
          width: isWebtoonMode ? "100%" : "92%",
          maxWidth: isWebtoonMode ? "600px" : "750px",
          background: isWebtoonMode ? "transparent" : currentTheme.paper,
          padding: isWebtoonMode ? "0" : "30px 20px",
          margin: "0 auto",
          boxShadow: isWebtoonMode ? "none" : "0 4px 20px rgba(0,0,0,0.2)"
        }}>
          {renderPageContent(pages)}

          {chapterIndex < chapters.length - 1 ? (
            <button 
              onClick={() => { setChapterIndex(prev => prev + 1); scrollRef.current.scrollTo(0, 0); }}
              style={{ ...s.nextChapterBtn, background: currentTheme.accent, color: "#000" }}
            >
              Chapitre Suivant <ChevronRight size={18} />
            </button>
          ) : (
            <div style={s.endMessage}>Fin de l'histoire</div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={s.miniSettings}>
            <div style={{ ...s.miniModal, background: currentTheme.paper, borderColor: currentTheme.border }}>
              <div style={s.miniRow}>
                <div style={s.miniGroup}>
                  <button onClick={() => setIsWebtoonMode(false)} style={!isWebtoonMode ? s.miniActive : s.miniBtn}><Zap size={14}/></button>
                  <button onClick={() => setIsWebtoonMode(true)} style={isWebtoonMode ? s.miniActive : s.miniBtn}><Layout size={14}/></button>
                </div>
                <div style={s.miniGroup}>
                  {Object.keys(themes).map(t => (
                    <button key={t} onClick={() => setTheme(t)} style={theme === t ? s.miniActive : s.miniBtn}>
                      {t === "dark" ? <Moon size={14}/> : t === "light" ? <Sun size={14}/> : t === "sepia" ? <Coffee size={14}/> : <Zap size={14}/>}
                    </button>
                  ))}
                </div>
                <X onClick={() => setShowSettings(false)} size={18} style={{ cursor: "pointer", marginLeft: "10px" }} />
              </div>
              <div style={{ ...s.miniRow, marginTop: "10px" }}>
                <button onClick={() => setFontSize(Math.max(12, fontSize - 1))} style={s.sizeBtnSmall}>-</button>
                <span style={{ fontSize: "12px", width: "40px", textAlign: "center" }}>{fontSize}px</span>
                <button onClick={() => setFontSize(Math.min(30, fontSize + 1))} style={s.sizeBtnSmall}>+</button>
                <button onClick={() => setAutoScroll(!autoScroll)} style={{ ...s.miniBtn, marginLeft: "auto", color: autoScroll ? currentTheme.accent : "#fff" }}>
                  <MousePointer2 size={14} /> Scroll
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const s = {
  container: { height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 15px", zIndex: 100 },
  headerTitle: { textAlign: "center" },
  storyTitle: { fontWeight: "800", fontSize: "12px", display: "block", textTransform: "uppercase" },
  chTitle: { fontSize: "10px", opacity: 0.6 },
  main: { flex: 1, overflowY: "auto", paddingBottom: "50px" },
  contentWrapper: { transition: "all 0.3s ease", borderRadius: "12px" },
  iconBtn: { background: "none", border: "none", color: "inherit", cursor: "pointer", padding: "5px" },
  miniSettings: { position: "fixed", top: "50px", left: "0", width: "100%", display: "flex", justifyContent: "center", zIndex: 110, padding: "0 10px" },
  miniModal: { width: "100%", maxWidth: "400px", padding: "12px", borderRadius: "15px", border: "1px solid", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" },
  miniRow: { display: "flex", alignItems: "center", gap: "10px" },
  miniGroup: { display: "flex", background: "rgba(0,0,0,0.2)", padding: "4px", borderRadius: "10px", gap: "4px" },
  miniBtn: { background: "none", border: "none", color: "#888", padding: "6px", cursor: "pointer", display: "flex", alignItems: "center" },
  miniActive: { background: "#00f7ff", color: "#000", border: "none", padding: "6px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center" },
  sizeBtnSmall: { background: "#222", color: "#fff", border: "none", width: "30px", height: "30px", borderRadius: "6px", cursor: "pointer" },
  nextChapterBtn: { width: "calc(100% - 40px)", margin: "40px 20px 20px", padding: "15px", borderRadius: "12px", border: "none", fontWeight: "900", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", cursor: "pointer" },
  endMessage: { textAlign: "center", padding: "40px", opacity: 0.5, fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px" }
};
