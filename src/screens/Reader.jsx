import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Settings, ChevronLeft, ChevronRight, 
  Layout, Play, X, Headphones, 
  Sun, Moon, Coffee, Zap, MousePointer2, Bookmark, Download,
  Menu, List, Volume2, VolumeX, Eye, BookOpen, Share2
} from "lucide-react";
import { COMICCRAFTE_STORIES } from "../data/COMICCRAFTE_DATA";

/**
 * COMPOSANT READER PRO - COMICCRAFTE STUDIO
 * Version : 3.0.0 (Fusion Intégrale)
 */
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

  // 🔊 AUDIO / SPEECH
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const scrollRef = useRef(null);
  const autoScrollInterval = useRef(null);

  // ================== THÈMES (CONFIG) ==================
  const themes = {
    dark: { bg: "#0a0a0c", paper: "#121214", text: "#e2e8f0", accent: "#00f7ff", border: "#1f2937", shadow: "rgba(0,0,0,0.5)" },
    light: { bg: "#f8fafc", paper: "#ffffff", text: "#0f172a", accent: "#0ea5e9", border: "#e2e8f0", shadow: "rgba(0,0,0,0.1)" },
    sepia: { bg: "#f4f1ea", paper: "#fdfbf7", text: "#433422", accent: "#92400e", border: "#e7e5e4", shadow: "rgba(67,52,34,0.1)" },
    neon: { bg: "#050505", paper: "#000000", text: "#00fff2", accent: "#ff00ff", border: "#333", shadow: "rgba(255,0,255,0.2)" }
  };
  const currentTheme = themes[theme];

  // ================== GESTION DES DONNÉES ==================
  const isOfflineStory = story?.isOffline;

  const storyData = useMemo(() => {
    if (isOfflineStory) return story; 
    return COMICCRAFTE_STORIES.find((s) => s.id === story?.id) || story || {};
  }, [story, isOfflineStory]);

  const chapters = useMemo(() => {
    return storyData?.content || storyData?.chapters || [];
  }, [storyData]);

  const currentChapter = chapters[chapterIndex] || { pages: [], title: `Chapitre ${chapterIndex + 1}` };
  const pages = currentChapter.pages || [];

  // ================== SYSTÈME AUDIO (TTS) ==================
  useEffect(() => {
    const loadVoices = () => {
      const v = speechSynthesis.getVoices();
      const frVoices = v.filter(voice => voice.lang.includes("fr"));
      setVoices(frVoices.length > 0 ? frVoices : v);
      if (v.length > 0) setSelectedVoice(frVoices[0] || v[0]);
    };
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => speechSynthesis.cancel();
  }, []);

  const handleSpeak = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const textToRead = pages.join(". ");
    const utterance = new SpeechSynthesisUtterance(textToRead);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // ================== PERSISTENCE (RÉCENTS & FAVORIS) ==================
  useEffect(() => {
    if (storyData.id) {
      const recent = JSON.parse(localStorage.getItem("comicrafte_recent")) || [];
      const updated = [{ 
        id: storyData.id, 
        title: storyData.title, 
        image: storyData.cover || storyData.img, 
        chapter: `Ch. ${chapterIndex + 1}`,
        type: storyData.type || "Manga",
        timestamp: Date.now() 
      }, ...recent.filter(r => r.id !== storyData.id)].slice(0, 20);
      localStorage.setItem("comicrafte_recent", JSON.stringify(updated));
    }
  }, [storyData.id, chapterIndex]);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("comicrafte_favorites")) || [];
    setIsSaved(!!favorites.find(f => f.id === storyData.id));
  }, [storyData.id]);

  const handleToggleSave = () => {
    const favorites = JSON.parse(localStorage.getItem("comicrafte_favorites")) || [];
    const isAlreadyFavorite = favorites.find(f => f.id === storyData.id);
    let newFavs = isAlreadyFavorite 
      ? favorites.filter(f => f.id !== storyData.id)
      : [...favorites, { id: storyData.id, title: storyData.title, image: storyData.cover || storyData.img, type: storyData.type || "Manga" }];
    
    localStorage.setItem("comicrafte_favorites", JSON.stringify(newFavs));
    setIsSaved(!isAlreadyFavorite);
  };

  // ================== DOWNLOAD (OFFLINE V2) ==================
  const saveForOffline = () => {
    try {
      const KEY = "comicrafte_downloads_v2";
      let downloads = JSON.parse(localStorage.getItem(KEY)) || [];
      if (downloads.some(item => item.id === storyData.id)) return alert("📥 Déjà dans vos téléchargements.");

      const cleanChapters = chapters.map(ch => ({
        ...ch,
        pages: (ch.pages || []).map(p => typeof p === "string" ? p : p?.content || "")
      }));

      const newDownload = {
        id: storyData.id, title: storyData.title, image: storyData.cover || storyData.img || "",
        isOffline: true, downloadedAt: Date.now(), chapters: cleanChapters
      };

      localStorage.setItem(KEY, JSON.stringify([...downloads, newDownload]));
      alert("✅ Histoire disponible hors-ligne !");
    } catch (e) { alert("❌ Erreur de stockage."); }
  };

  // ================== LOGIQUE DE NAVIGATION ==================
  useEffect(() => {
    if (autoScroll) {
      autoScrollInterval.current = setInterval(() => {
        if (scrollRef.current) scrollRef.current.scrollTop += 1;
      }, 40);
    } else clearInterval(autoScrollInterval.current);
    return () => clearInterval(autoScrollInterval.current);
  }, [autoScroll]);

  const renderPageContent = (contentArray) => {
    return contentArray.map((item, i) => {
      if (typeof item === "string" && (item.startsWith('http') || item.startsWith('data:image'))) {
        return (
          <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={i} src={item} alt="" 
            style={{ width: "100%", display: "block", marginBottom: isWebtoonMode ? "0" : "20px", borderRadius: isWebtoonMode ? "0" : "8px" }} />
        );
      }
      return (
        <p key={i} style={{ fontSize: `${fontSize}px`, lineHeight: "1.8", marginBottom: "25px", textAlign: "justify", padding: isWebtoonMode ? "0 20px" : "0" }}>
          {item}
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

      {/* --- MENU DES RÉGLAGES (ANIMÉ) --- */}
      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} style={s.settingsOverlay}>
            <div style={{ ...s.settingsCard, background: currentTheme.paper, borderColor: currentTheme.border }}>
              <div style={s.settingRow}>
                <span style={s.label}>Mode de lecture</span>
                <div style={s.toggleGroup}>
                  <button onClick={() => setIsWebtoonMode(false)} style={!isWebtoonMode ? s.activeBtn : s.inactiveBtn}><BookOpen size={16}/> Classique</button>
                  <button onClick={() => setIsWebtoonMode(true)} style={isWebtoonMode ? s.activeBtn : s.inactiveBtn}><Layout size={16}/> Webtoon</button>
                </div>
              </div>

              <div style={s.settingRow}>
                <span style={s.label}>Thèmes d'affichage</span>
                <div style={s.toggleGroup}>
                  {Object.keys(themes).map(t => (
                    <button key={t} onClick={() => setTheme(t)} style={theme === t ? { ...s.themeBtn, border: `2px solid ${currentTheme.accent}` } : s.themeBtn}>
                       <div style={{ width: 15, height: 15, borderRadius: "50%", background: themes[t].bg, border: "1px solid #555" }} />
                    </button>
                  ))}
                </div>
              </div>

              <div style={s.settingRow}>
                <span style={s.label}>Outils Intelligents</span>
                <div style={s.toggleGroup}>
                  <button onClick={handleSpeak} style={{ ...s.toolBtn, color: isSpeaking ? currentTheme.accent : "#fff" }}>
                    {isSpeaking ? <VolumeX size={18}/> : <Volume2 size={18}/>} Audio
                  </button>
                  <button onClick={() => setAutoScroll(!autoScroll)} style={{ ...s.toolBtn, color: autoScroll ? currentTheme.accent : "#fff" }}>
                    <MousePointer2 size={18}/> Scroll
                  </button>
                </div>
              </div>

              <div style={s.settingRow}>
                <span style={s.label}>Taille du texte</span>
                <div style={s.sizeControls}>
                  <button onClick={() => setFontSize(f => Math.max(12, f-2))} style={s.sizeBtn}>A-</button>
                  <span style={s.sizeVal}>{fontSize}px</span>
                  <button onClick={() => setFontSize(f => Math.min(32, f+2))} style={s.sizeBtn}>A+</button>
                </div>
              </div>

              <button onClick={() => setShowSettings(false)} style={s.closeSettingsBtn}>Fermer les réglages</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- DRAWER DES CHAPITRES (LATÉRAL) --- */}
      <AnimatePresence>
        {showChapters && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowChapters(false)} style={s.drawerBackdrop} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25 }} style={{ ...s.drawer, background: currentTheme.paper }}>
              <div style={{ ...s.drawerHeader, borderBottom: `1px solid ${currentTheme.border}` }}>
                <h3>Chapitres</h3>
                <X onClick={() => setShowChapters(false)} style={s.pointer} />
              </div>
              <div style={s.drawerList}>
                {chapters.map((ch, i) => (
                  <div key={i} onClick={() => { setChapterIndex(i); setShowChapters(false); scrollRef.current.scrollTo(0,0); }}
                    style={{ ...s.chapterItem, background: i === chapterIndex ? currentTheme.accent + "22" : "transparent", color: i === chapterIndex ? currentTheme.accent : "inherit" }}>
                    <span style={s.chNum}>{i + 1}</span>
                    <span style={s.chLabel}>{ch.title || `Chapitre ${i + 1}`}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ================== STYLES COMPLETS (OBJECT-BASED) ==================
const s = {
  container: { height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "'Inter', sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", zIndex: 100 },
  headerTitle: { textAlign: "center", cursor: "pointer" },
  storyTitle: { fontWeight: "900", fontSize: "11px", display: "flex", alignItems: "center", gap: 5, justifyContent: "center", textTransform: "uppercase", letterSpacing: "1px" },
  chTitle: { fontSize: "13px", fontWeight: "500", opacity: 0.7 },
  main: { flex: 1, overflowY: "auto", scrollBehavior: "smooth" },
  contentWrapper: { margin: "0 auto", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)", borderRadius: "0 0 15px 15px" },
  iconBtn: { background: "none", border: "none", color: "inherit", cursor: "pointer", padding: "6px", borderRadius: "50%", display: "flex", alignItems: "center" },
  nextBtn: { width: "calc(100% - 40px)", margin: "40px 20px 20px", padding: "18px", borderRadius: "16px", border: "none", fontWeight: "900", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", cursor: "pointer", fontSize: "16px" },
  endMessage: { textAlign: "center", padding: "60px 20px", opacity: 0.4, fontSize: "14px", fontStyle: "italic" },
  
  // Settings Styles
  settingsOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 200, display: "flex", alignItems: "flex-end", background: "rgba(0,0,0,0.6)" },
  settingsCard: { width: "100%", borderTopLeftRadius: "25px", borderTopRightRadius: "25px", padding: "25px", border: "1px solid", display: "flex", flexDirection: "column", gap: "20px" },
  settingRow: { display: "flex", flexDirection: "column", gap: "10px" },
  label: { fontSize: "12px", textTransform: "uppercase", fontWeight: "700", opacity: 0.5, letterSpacing: "1px" },
  toggleGroup: { display: "flex", gap: "10px", background: "rgba(0,0,0,0.2)", padding: "5px", borderRadius: "12px" },
  activeBtn: { flex: 1, background: "#fff", color: "#000", border: "none", padding: "10px", borderRadius: "8px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "13px" },
  inactiveBtn: { flex: 1, background: "none", color: "#888", border: "none", padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "13px" },
  themeBtn: { padding: "10px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid transparent", cursor: "pointer" },
  toolBtn: { flex: 1, background: "rgba(255,255,255,0.05)", border: "none", padding: "12px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontWeight: "600" },
  sizeControls: { display: "flex", alignItems: "center", gap: "20px" },
  sizeBtn: { width: "45px", height: "45px", borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: "18px", cursor: "pointer" },
  sizeVal: { fontSize: "18px", fontWeight: "800", minWidth: "50px", textAlign: "center" },
  closeSettingsBtn: { marginTop: "10px", padding: "15px", borderRadius: "12px", border: "none", background: "#333", color: "#fff", fontWeight: "700" },

  // Drawer Styles
  drawerBackdrop: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.7)", zIndex: 250 },
  drawer: { position: "fixed", right: 0, top: 0, width: "85%", maxWidth: "350px", height: "100%", zIndex: 260, boxShadow: "-10px 0 50px rgba(0,0,0,0.8)", display: "flex", flexDirection: "column" },
  drawerHeader: { padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  drawerList: { flex: 1, overflowY: "auto", padding: "10px" },
  chapterItem: { display: "flex", alignItems: "center", gap: "15px", padding: "15px", borderRadius: "12px", marginBottom: "8px", cursor: "pointer" },
  chNum: { fontSize: "18px", fontWeight: "900", opacity: 0.2 },
  chLabel: { fontWeight: "600", fontSize: "15px" },
  pointer: { cursor: "pointer" }
};