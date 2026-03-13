import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from "../../../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Settings, Volume2, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function Reader({ story, setView }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [fontCase, setFontCase] = useState('normal');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isNovelMode, setIsNovelMode] = useState(false);

  const contentRef = useRef(null);

  const pages = story?.pages || [];

  // Détection automatique : texte long = mode scroll
  useEffect(() => {
    if (!story) return;
    const textBlocks = pages.filter(p => p.type === "text");
    setIsNovelMode(textBlocks.length > 3); // Si beaucoup de texte → mode novel
  }, [story]);

  // CHARGEMENT POSITION
  useEffect(() => {
    if (!story || !auth.currentUser) return;

    const loadPosition = async () => {
      const docRef = doc(db, 'users', auth.currentUser.uid, 'readingPositions', story.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        if (isNovelMode && contentRef.current) {
          contentRef.current.scrollTop = data.scroll || 0;
        } else {
          setCurrentPage(data.page || 0);
        }
      }
    };

    loadPosition();
  }, [story, isNovelMode]);

  // SAUVEGARDE AUTO
  useEffect(() => {
    if (!auth.currentUser || !story) return;

    const saveData = async () => {
      const payload = {
        lastRead: serverTimestamp()
      };

      if (isNovelMode && contentRef.current) {
        payload.scroll = contentRef.current.scrollTop;
      } else {
        payload.page = currentPage;
      }

      await setDoc(
        doc(db, 'users', auth.currentUser.uid, 'readingPositions', story.id),
        payload,
        { merge: true }
      );
    };

    saveData();
  }, [currentPage]);

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const reportBug = async () => {
    const bug = prompt('Décrivez le problème rencontré :');
    if (!bug) return;

    await setDoc(doc(db, 'bugs', `${story.id}-${Date.now()}`), {
      userId: auth.currentUser?.uid || 'anon',
      storyId: story.id,
      message: bug,
      timestamp: serverTimestamp()
    });

    alert('Signalement envoyé !');
  };

  if (!story) return <div style={s.error}>Sélectionnez une histoire...</div>;

  const genreColors = {
    romance: '#f9a8d4',
    aventure: '#3b82f6',
    darkRomance: '#111111',
    action: '#ef4444',
    mystere: '#8b5cf6',
    fantaisie: '#ec4899'
  };

  const themeColor = genreColors[story?.genre] || '#7c3aed';

  return (
    <div style={{ ...s.page, backgroundColor: "#020617" }}>

      {/* HEADER */}
      <nav style={{ ...s.nav, borderBottom: `1px solid ${themeColor}44` }}>
        <ArrowLeft onClick={() => setView('home')} style={s.icon} />
        <div style={s.headerInfo}>
          <span style={{ ...s.chapterTitle, color: themeColor, textShadow: `0 0 10px ${themeColor}` }}>
            {story.title?.toUpperCase()}
          </span>
          {!isNovelMode && (
            <span style={s.pageCount}>{currentPage + 1} / {pages.length}</span>
          )}
        </div>
        <Settings onClick={() => setShowSettings(true)} style={s.icon} />
      </nav>

      {/* CONTENU */}
      <div
        ref={contentRef}
        style={{
          ...s.content,
          overflowY: isNovelMode ? "auto" : "hidden",
          paddingBottom: isNovelMode ? "120px" : "20px"
        }}
      >
        {isNovelMode ? (
          // MODE SCROLL CONFORT LONG
          <div style={{ ...s.textWrapper, lineHeight: 1.9 }}>
            {pages.map((block, index) => (
              <div key={index}>
                {block.type === "image" && (
                  <img src={block.src} alt="" style={s.image} />
                )}
                {block.type === "text" && (
                  <p
                    style={{
                      ...s.storyText,
                      fontSize: `${fontSize}px`,
                      textTransform: fontCase,
                      marginBottom: "28px"
                    }}
                  >
                    {block.text}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          // MODE PAGE PAR PAGE
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={s.textWrapper}
            >
              {pages[currentPage]?.type === "image" ? (
                <div style={s.imageContainer}>
                  <img src={pages[currentPage].src} style={s.image} alt="" />
                </div>
              ) : (
                <p
                  style={{
                    ...s.storyText,
                    fontSize: `${fontSize}px`,
                    textTransform: fontCase,
                    lineHeight: "1.8"
                  }}
                >
                  {pages[currentPage]?.text}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* NAVIGATION BASSE (inchangée visuellement) */}
      {!isNovelMode && (
        <div style={s.bottomBar}>
          <div style={s.navGroup}>
            <button onClick={prevPage} disabled={currentPage === 0} style={s.navCircle}>
              <ChevronLeft size={24} />
            </button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                ...s.voiceBtn,
                borderColor: themeColor,
                boxShadow: `0 0 15px ${themeColor}66`
              }}
            >
              <Volume2 color={isPlaying ? themeColor : "white"} size={28} />
            </motion.button>

            <button onClick={nextPage} disabled={currentPage === pages.length - 1} style={s.navCircle}>
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}

      {/* MODAL SETTINGS (inchangé) */}
      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={s.modalOverlay}>
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} style={s.settingsModal}>
              <div style={s.modalHeader}>
                <h3>Paramètres de lecture</h3>
                <X onClick={() => setShowSettings(false)} style={s.icon} />
              </div>
              <div style={s.settingsGrid}>
                <button onClick={() => setFontSize(fontSize + 2)} style={s.modalBtn}>Agrandir (A+)</button>
                <button onClick={() => setFontSize(Math.max(12, fontSize - 2))} style={s.modalBtn}>Réduire (A-)</button>
                <button onClick={() => setFontCase(fontCase === 'normal' ? 'uppercase' : 'normal')} style={s.modalBtn}>Majuscules On/Off</button>
                <button onClick={reportBug} style={{ ...s.modalBtn, color: '#ef4444' }}>Signaler un bug</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}