import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Layout,
  Play,
  X
} from "lucide-react";
import { COMICCRAFTE_STORIES } from "../data/COMICCRAFTE_DATA";
import { PUBLIC_STORIES } from "../data/publicStories";

export default function Reader({ story, setView, type = "public", nextStory = null }) {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState("dark");
  const [showSettings, setShowSettings] = useState(false);
  const [isWebtoonMode, setIsWebtoonMode] = useState(false);
  const [autoScroll, setAutoScroll] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [isReadingAudio, setIsReadingAudio] = useState(false);
  const [audioInstance, setAudioInstance] = useState(null);

  const scrollRef = useRef(null);
  const autoScrollRef = useRef(null);

  // ----------------- SOURCES -----------------
  const dataSource = type === "comicrafte" ? COMICCRAFTE_STORIES : PUBLIC_STORIES;
  const storyData = useMemo(() => {
    return dataSource.find((s) => s.id === story?.id) || story || {};
  }, [story, dataSource]);

  const chapters = useMemo(() => {
    if (storyData?.chapters && storyData.chapters.length > 0) return storyData.chapters;
    if (storyData?.pages && storyData.pages.length > 0) return [{ pages: storyData.pages }];
    return [];
  }, [storyData]);

  const pages = chapters[chapterIndex]?.pages || [];

  // ----------------- THEMES -----------------
  const themes = {
    dark: { bg: "#020617", color: "#e2e8f0", panel: "#111827" },
    light: { bg: "#ffffff", color: "#111827", panel: "#f3f4f6" },
    sepia: { bg: "#f4ecd8", color: "#5b4636", panel: "#e8dcc3" },
    neon: { bg: "#0a0a0a", color: "#00fff2", panel: "#111" }
  };

  // ----------------- AUTO SCROLL -----------------
  useEffect(() => {
    if (!autoScroll) {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
      return;
    }
    autoScrollRef.current = setInterval(() => {
      if (scrollRef.current) scrollRef.current.scrollTop += 1;
    }, 20);
    return () => clearInterval(autoScrollRef.current);
  }, [autoScroll]);

  // ----------------- NAVIGATION -----------------
  const nextPage = useCallback(() => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((p) => p + 1);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    } else if (chapterIndex < chapters.length - 1) {
      setChapterIndex((c) => c + 1);
      setCurrentPage(0);
    } else if (typeof nextStory === "function") {
      nextStory();
    }
  }, [currentPage, pages.length, chapterIndex, chapters.length, nextStory]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) setCurrentPage((p) => p - 1);
    else if (chapterIndex > 0) {
      setChapterIndex((c) => c - 1);
      setCurrentPage(chapters[chapterIndex - 1].pages.length - 1);
    }
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [currentPage, chapterIndex, chapters]);

  // ----------------- RENDER CONTENT -----------------
  const renderContent = (pageData, index) => {
    const content = pageData?.content || pageData;
    const typeContent =
      pageData?.type ||
      (typeof content === "string" && (content.startsWith("http") ? "image" : "text"));

    if (typeContent === "image") {
      return (
        <img
          key={index}
          src={content}
          alt={`Page ${index + 1}`}
          style={{
            width: "100%",
            borderRadius: isWebtoonMode ? 0 : 12,
            marginBottom: isWebtoonMode ? 2 : 20,
            display: "block",
            boxShadow: isWebtoonMode ? "none" : "0 4px 20px rgba(0,0,0,0.5)"
          }}
        />
      );
    }

    return (
      <div
        key={index}
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: "1.9",
          textAlign: "justify",
          whiteSpace: "pre-line",
          padding: "10px 0"
        }}
      >
        {content}
      </div>
    );
  };

  // ----------------- AUDIO READER -----------------
  const readAudio = () => {
    if (isReadingAudio) {
      audioInstance?.pause();
      setIsReadingAudio(false);
    } else {
      const utter = new SpeechSynthesisUtterance(
        typeof pages[currentPage] === "string" ? pages[currentPage] : pages[currentPage]?.content
      );
      utter.rate = 1;
      speechSynthesis.speak(utter);
      setAudioInstance(utter);
      setIsReadingAudio(true);
      utter.onend = () => setIsReadingAudio(false);
    }
  };

  // ----------------- FALLBACK -----------------
  if (!storyData || pages.length === 0) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: themes[theme].bg,
          color: themes[theme].color,
          gap: 20
        }}
      >
        <p>Cette histoire n'a pas encore de pages disponibles.</p>
        <button
          onClick={() => setView("home")}
          style={{ background: "#00f7ff", color: "#000", padding: 10, borderRadius: 8, border: "none" }}
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  // ----------------- RENDER -----------------
  return (
    <div style={{ minHeight: "100vh", background: themes[theme].bg, color: themes[theme].color, position: "relative" }}>
      {/* HEADER */}
      <div
        style={{
          position: "sticky",
          top: 0,
          padding: "15px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: themes[theme].bg + "CC",
          backdropFilter: "blur(10px)",
          zIndex: 100,
          borderBottom: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        <ArrowLeft onClick={() => setView("home")} style={{ cursor: "pointer" }} />
        <div style={{ fontSize: 14, fontWeight: "bold", textAlign: "center" }}>
          {storyData.title?.toUpperCase()} <br />
          Chapitre {chapterIndex + 1} / {chapters.length} · Page {currentPage + 1} / {pages.length}
        </div>
        <Settings onClick={() => setShowSettings(true)} style={{ cursor: "pointer" }} />
      </div>

      {/* CONTENT */}
      <div ref={scrollRef} style={{ height: "calc(100vh - 70px)", overflowY: "auto", padding: isWebtoonMode ? 0 : 20 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", paddingBottom: 120 }}>
          {isWebtoonMode ? (
            pages.map((p, i) => renderContent(p, i))
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={currentPage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {renderContent(pages[currentPage], currentPage)}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* CONTROLS */}
      {!isWebtoonMode && (
        <div
          style={{
            position: "fixed",
            bottom: 30,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "12px 25px",
            background: themes[theme].panel,
            borderRadius: 50,
            display: "flex",
            gap: 15,
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            zIndex: 20,
            border: "1px solid rgba(255,255,255,0.1)"
          }}
        >
          <ChevronLeft onClick={prevPage} style={{ cursor: "pointer", opacity: currentPage === 0 && chapterIndex === 0 ? 0.3 : 1 }} />
          <Bookmark
            onClick={() => {
              if (!bookmarks.includes(currentPage)) setBookmarks([...bookmarks, currentPage]);
            }}
            style={{ cursor: "pointer", color: bookmarks.includes(currentPage) ? "#00f7ff" : themes[theme].color }}
          />
          <Play onClick={readAudio} style={{ cursor: "pointer", color: isReadingAudio ? "#00f7ff" : themes[theme].color }} />
          <ChevronRight
            onClick={nextPage}
            style={{ cursor: "pointer", opacity: currentPage === pages.length - 1 && chapterIndex === chapters.length - 1 ? 0.3 : 1 }}
          />
        </div>
      )}

      {/* SETTINGS */}
      {showSettings && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 200 }}>
          <div style={{ background: themes[theme].panel, padding: 25, borderRadius: 20, width: 300 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h3>Paramètres</h3>
              <X onClick={() => setShowSettings(false)} style={{ cursor: "pointer" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
              <button
                onClick={() => setIsWebtoonMode(!isWebtoonMode)}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: "none",
                  background: isWebtoonMode ? "#00f7ff" : "#333",
                  color: isWebtoonMode ? "#000" : "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10
                }}
              >
                <Layout size={18} /> {isWebtoonMode ? "Mode Page" : "Mode Webtoon"}
              </button>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {Object.keys(themes).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    style={{ flex: 1, margin: 2, padding: 10, borderRadius: 8, border: "none", background: themes[t].bg, color: themes[t].color }}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              <button onClick={() => setFontSize(f => f + 2)} style={{ padding: 12, borderRadius: 10, background: "#00f7ff", color: "#000", border: "none" }}>
                Agrandir le texte
              </button>
              <button onClick={() => setFontSize(f => Math.max(12, f - 2))} style={{ padding: 12, borderRadius: 10, background: "#444", color: "#fff", border: "none" }}>
                Réduire le texte
              </button>
              <button onClick={() => setAutoScroll(!autoScroll)} style={{ padding: 12, borderRadius: 10, background: autoScroll ? "#00f7ff" : "#333", color: autoScroll ? "#000" : "#fff", border: "none" }}>
                {autoScroll ? "Arrêter Auto-scroll" : "Activer Auto-scroll"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}