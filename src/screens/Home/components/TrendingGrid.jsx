import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../../../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Settings, Volume2, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function Reader({ story, setView }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [fontCase, setFontCase] = useState("normal");
  const [showSettings, setShowSettings] = useState(false);
  const [isNovelMode, setIsNovelMode] = useState(false);

  const contentRef = useRef(null);
  const pages = story?.pages || [];

  /* ---------------- MODE AUTO ---------------- */

  useEffect(() => {
    if (!story?.pages) return;

    const textBlocks = story.pages.filter(p => p.type === "text");
    setIsNovelMode(textBlocks.length > 3);
  }, [story]);

  /* ---------------- LOAD POSITION ---------------- */

  useEffect(() => {
    if (!story?.id || !auth.currentUser) return;

    const loadPosition = async () => {
      try {
        const ref = doc(
          db,
          "users",
          auth.currentUser.uid,
          "readingPositions",
          story.id
        );

        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          if (isNovelMode && contentRef.current) {
            contentRef.current.scrollTop = data.scroll || 0;
          } else {
            setCurrentPage(data.page || 0);
          }
        }
      } catch (err) {
        console.log("Load position error:", err);
      }
    };

    loadPosition();
  }, [story?.id, isNovelMode]);

  /* ---------------- SAVE POSITION ---------------- */

  useEffect(() => {
    if (!story?.id || !auth.currentUser) return;

    const save = async () => {
      try {
        const payload = {
          lastRead: serverTimestamp(),
        };

        if (isNovelMode && contentRef.current) {
          payload.scroll = contentRef.current.scrollTop;
        } else {
          payload.page = currentPage;
        }

        await setDoc(
          doc(
            db,
            "users",
            auth.currentUser.uid,
            "readingPositions",
            story.id
          ),
          payload,
          { merge: true }
        );
      } catch (err) {
        console.log("Save error:", err);
      }
    };

    save();
  }, [currentPage, isNovelMode, story?.id]);

  /* ---------------- NAVIGATION ---------------- */

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(p => p + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(p => p - 1);
    }
  };

  /* ---------------- PROTECTION ---------------- */

  if (!story || !story.pages) {
    return <div style={{ padding: 20 }}>Sélectionnez une histoire...</div>;
  }

  const themeColor = "#7c3aed";

  /* ---------------- RENDER ---------------- */

  return (
    <div style={{ background: "#020617", minHeight: "100vh", color: "white" }}>

      {/* HEADER */}
      <nav style={{ padding: 15, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <ArrowLeft onClick={() => setView("home")} style={{ cursor: "pointer" }} />
        <span style={{ color: themeColor, fontWeight: "bold" }}>
          {story.title}
        </span>
        <Settings onClick={() => setShowSettings(true)} style={{ cursor: "pointer" }} />
      </nav>

      {/* CONTENT */}
      <div
        ref={contentRef}
        style={{
          padding: 20,
          overflowY: isNovelMode ? "auto" : "hidden",
        }}
      >
        {isNovelMode ? (
          pages.map((block, index) => (
            <div key={index}>
              {block.type === "image" && (
                <img
                  src={block.src}
                  alt=""
                  style={{ width: "100%", marginBottom: 20 }}
                />
              )}
              {block.type === "text" && (
                <p
                  style={{
                    fontSize: `${fontSize}px`,
                    textTransform: fontCase,
                    lineHeight: 1.8,
                    marginBottom: 20,
                  }}
                >
                  {block.text}
                </p>
              )}
            </div>
          ))
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {pages[currentPage]?.type === "image" ? (
                <img
                  src={pages[currentPage].src}
                  alt=""
                  style={{ width: "100%" }}
                />
              ) : (
                <p
                  style={{
                    fontSize: `${fontSize}px`,
                    textTransform: fontCase,
                    lineHeight: 1.8,
                  }}
                >
                  {pages[currentPage]?.text}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* NAVIGATION */}
      {!isNovelMode && (
        <div style={{ display: "flex", justifyContent: "center", gap: 20, padding: 20 }}>
          <button onClick={prevPage} disabled={currentPage === 0}>
            <ChevronLeft />
          </button>

          <button onClick={nextPage} disabled={currentPage === pages.length - 1}>
            <ChevronRight />
          </button>
        </div>
      )}

      {/* SETTINGS */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ background: "#111", padding: 20 }}>
              <X onClick={() => setShowSettings(false)} style={{ cursor: "pointer" }} />
              <button onClick={() => setFontSize(f => f + 2)}>A+</button>
              <button onClick={() => setFontSize(f => Math.max(12, f - 2))}>A-</button>
              <button onClick={() => setFontCase(fontCase === "normal" ? "uppercase" : "normal")}>
                Majuscules
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}