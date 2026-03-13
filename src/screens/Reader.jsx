
// 🔥 Reader V6 ULTRA PREMIUM STABLE (No Speech – Clean & Production Ready)

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Maximize,
  Sun,
  Moon,
  X
} from "lucide-react";

export default function Reader({ story, setView, nextStory = null }) {
  /* ---------------- SAFE GUARD ---------------- */

  if (!story || !Array.isArray(story.pages) || story.pages.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Sélectionnez une histoire...
      </div>
    );
  }

  /* ---------------- STATE ---------------- */

  const pages = story.pages;

  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState("dark");
  const [showSettings, setShowSettings] = useState(false);
  const [autoScroll, setAutoScroll] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const autoScrollRef = useRef(null);

  /* ---------------- THEMES ---------------- */

  const themes = {
    dark: { bg: "#020617", color: "#e2e8f0", panel: "#111827" },
    light: { bg: "#ffffff", color: "#111827", panel: "#f3f4f6" },
    sepia: { bg: "#f4ecd8", color: "#5b4636", panel: "#e8dcc3" }
  };

  /* ---------------- AUTO SCROLL ---------------- */

  useEffect(() => {
    if (!autoScroll) {
      clearInterval(autoScrollRef.current);
      return;
    }

    autoScrollRef.current = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop += 1;
      }
    }, 20);

    return () => clearInterval(autoScrollRef.current);
  }, [autoScroll]);

  /* ---------------- NAVIGATION ---------------- */

  const nextPage = useCallback(() => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((p) => p + 1);
    } else if (typeof nextStory === "function") {
      nextStory();
    }
  }, [currentPage, pages.length, nextStory]);

  const prevPage = useCallback(() => {
    setCurrentPage((p) => (p > 0 ? p - 1 : 0));
  }, []);

  /* ---------------- BOOKMARK ---------------- */

  const addBookmark = () => {
    if (bookmarks.includes(currentPage)) return;
    const updated = [...bookmarks, currentPage];
    setBookmarks(updated);
    localStorage.setItem(`bookmarks_${story.id || "default"}`, JSON.stringify(updated));
  };

  useEffect(() => {
    const saved = localStorage.getItem(`bookmarks_${story.id || "default"}`);
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch {
        setBookmarks([]);
      }
    }
  }, [story.id]);

  /* ---------------- SWIPE MOBILE ---------------- */

  useEffect(() => {
    let startX = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      const diff = e.changedTouches[0].clientX - startX;
      if (diff > 60) prevPage();
      if (diff < -60) nextPage();
    };

    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("touchstart", handleTouchStart);
    el.addEventListener("touchend", handleTouchEnd);

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [nextPage, prevPage]);

  /* ---------------- FULLSCREEN ---------------- */

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100vh",
        background: themes[theme].bg,
        color: themes[theme].color,
        transition: "0.3s ease"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          position: "sticky",
          top: 0,
          padding: 15,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backdropFilter: "blur(10px)"
        }}
      >
        <ArrowLeft onClick={() => setView("home")} style={{ cursor: "pointer" }} />
        <div>{currentPage + 1} / {pages.length}</div>
        <Settings onClick={() => setShowSettings(true)} style={{ cursor: "pointer" }} />
      </div>

      {/* CONTENT */}
      <div
        ref={scrollRef}
        style={{
          padding: 30,
          paddingBottom: 140,
          overflowY: "auto",
          maxHeight: "80vh"
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {pages[currentPage]?.type === "image" ? (
              <img
                src={pages[currentPage]?.src}
                alt=""
                style={{ width: "100%", borderRadius: 16 }}
              />
            ) : (
              <p style={{ fontSize, lineHeight: 1.9 }}>
                {pages[currentPage]?.text || ""}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* BOTTOM BAR */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 20,
          display: "flex",
          justifyContent: "center",
          gap: 20,
          backdropFilter: "blur(12px)"
        }}
      >
        <button onClick={prevPage}><ChevronLeft /></button>
        <button onClick={nextPage}><ChevronRight /></button>
        <button onClick={addBookmark}><Bookmark /></button>
        <button onClick={toggleFullscreen}><Maximize /></button>
      </div>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            style={{
              background: themes[theme].panel,
              padding: 25,
              borderRadius: 18,
              width: 320
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>Settings</h3>
              <X onClick={() => setShowSettings(false)} style={{ cursor: "pointer" }} />
            </div>

            <div style={{ marginTop: 15, display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={() => setFontSize((f) => f + 2)}>Font +</button>
              <button onClick={() => setFontSize((f) => Math.max(12, f - 2))}>Font -</button>
              <button onClick={() => setTheme("dark")}><Moon /></button>
              <button onClick={() => setTheme("light")}><Sun /></button>
              <button onClick={() => setTheme("sepia")}>Sepia</button>
              <button onClick={() => setAutoScroll((a) => !a)}>
                {autoScroll ? "Stop Auto Scroll" : "Auto Scroll"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}