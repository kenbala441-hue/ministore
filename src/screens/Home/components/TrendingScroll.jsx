import React, { useMemo, useState, useRef } from "react";
import { PUBLIC_STORIES } from "../../../data/publicStories";
import { COMICCRAFTE_STORIES } from "../../../data/Action";
import { Play, Eye, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TrendingScroll({
  setView,
  setSelectedStory,
  stories = [],
  type = "public",
}) {
    // 1. LES ÉTATS ET RÉFÉRENCES (TOUT EN HAUT)
  const [preview, setPreview] = useState(null);
  const [index, setIndex] = useState(0);
  const timer = useRef(null);
  const touchStartTime = useRef(0);

  const data = useMemo(() => {
    const source = stories?.length > 0 ? stories : (type === "comicrafte" ? COMICCRAFTE_STORIES : PUBLIC_STORIES);
    return Array.isArray(source) ? source.slice(0, 12) : [];
  }, [stories, type]);

  // 2. NAVIGATION VERS LE LECTEUR
  const openStory = (story) => {
    if (!story) return;
    setSelectedStory(story);
    setView("reader"); // Correction écran noir
    setPreview(null);
  };

  // 3. LOGIQUE DE TOUCHER (CLIC VS PREVIEW)
  const handleTouchStart = (story) => {
    touchStartTime.current = Date.now();
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setPreview(story);
    }, 600); 
  };

  const handleTouchEnd = (story) => {
    if (timer.current) clearTimeout(timer.current);
    const touchDuration = Date.now() - touchStartTime.current;

    // Ouvre seulement si c'est un clic rapide et pas de preview ouverte
    if (!preview && touchDuration < 250) {
      openStory(story);
    }
  };

  return ( <div className="trend-container">
      <div className="trend-header">
        <span className="accent-bar"></span>
        <h2>{type === "comicrafte" ? "COMICCRAFTE ORIGINALS" : "CLASSIQUES GRATUITS"}</h2>
      </div>

      <div className="trend-scroll">
        {data.map((story) => (
          <motion.div
            key={story.id}
            className="trend-card"
            whileTap={{ scale: 0.96 }}
            onTouchStart={() => handleTouchStart(story)}
            onTouchEnd={() => handleTouchEnd(story)}
            // On retire le onClick pour laisser handleTouchEnd gérer proprement
          >
            <img src={story.coverImage} alt={story.title} loading="lazy" />
            <div className="card-overlay">
              <div className="card-info">
                <h4>{story.title}</h4>
                <div className="card-meta">
                  <span><Eye size={10} /> {story.viewsCount || '2.4k'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* PREVIEW : Utilisation de Framer Motion pour éviter le "bug noir" et avoir de la fluidité */}
      <AnimatePresence>
        {preview && (
          <motion.div 
            className="preview-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="preview-content">
              <button className="close-btn" onClick={(e) => { e.stopPropagation(); setPreview(null); }}>
                <X size={20} color="#fff" />
              </button>
              
              <img src={preview.coverImage} className="preview-img" alt="preview" />
              
              <div className="preview-details">
                <h3>{preview.title}</h3>
                <p>{preview.description?.substring(0, 80)}...</p>
                <button className="read-now" onClick={() => openStory(preview)}>
                  COMMENCER À LIRE
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .trend-container { margin: 20px 0; background: #000; }
        
        .trend-header { 
          display: flex; 
          align-items: center; 
          gap: 10px; 
          padding: 0 15px; 
          margin-bottom: 12px; 
        }

        .accent-bar { 
          width: 4px; 
          height: 16px; 
          background: #00ff88; 
          border-radius: 10px; 
        }

        .trend-header h2 { 
          color: #fff; 
          font-size: 14px; 
          font-weight: 900; 
          letter-spacing: 0.5px;
        }

        .trend-scroll { 
          display: flex; 
          gap: 10px; 
          overflow-x: auto; 
          padding: 0 15px; 
          scrollbar-width: none; 
        }
        
        .trend-scroll::-webkit-scrollbar { display: none; }

        .trend-card { 
          min-width: 110px; 
          width: 110px;
          height: 150px; 
          border-radius: 6px; 
          overflow: hidden; 
          position: relative; 
          flex-shrink: 0;
          background: #1a1a1a;
        }

        .trend-card img { width: 100%; height: 100%; object-fit: cover; }

        .card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(transparent 40%, rgba(0,0,0,0.9));
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 8px;
        }

        .card-info h4 {
          color: #fff;
          font-size: 11px;
          margin: 0;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-meta { color: #aaa; font-size: 9px; margin-top: 4px; display: flex; align-items: center; gap: 4px; }

        /* PREVIEW SYSTEM MODERNE */
        .preview-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .preview-content {
          width: 100%;
          max-width: 320px;
          background: #111;
          border-radius: 15px;
          overflow: hidden;
          position: relative;
          border: 1px solid #333;
        }

        .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.5);
          border: none;
          border-radius: 50%;
          padding: 5px;
          z-index: 10;
        }

        .preview-img { width: 100%; height: 200px; object-fit: cover; }

        .preview-details { padding: 15px; text-align: center; }
        
        .preview-details h3 { color: #fff; font-size: 18px; margin-bottom: 8px; }
        
        .preview-details p { color: #999; font-size: 12px; line-height: 1.4; margin-bottom: 15px; }

        .read-now {
          background: #00ff88;
          color: #000;
          border: none;
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          font-weight: 900;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
}
