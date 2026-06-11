import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Eye, BookOpen, Layers } from "lucide-react";

export default function VerticalSection({ 
  title = "TITRE SECTION", 
  data = [], 
  setView, 
  setSelectedStory,
  neonColor = "#00f7ff", // Cyan par défaut pour changer du jaune
  limit = 15
}) {

  // =========================
  // NETTOYAGE DES DONNÉES
  // =========================
  const cleanData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data
      .filter(Boolean)
      .slice(0, limit)
      .map((item, index) => ({
        id: item?.id || `manga-${index}`,
        title: item?.title || "Titre inconnu",
        cover: item?.coverImage || item?.cover || "https://via.placeholder.com/300x450/111/222?text=Manga",
        views: item?.viewsCount || 0,
        genre: item?.genres?.[0] || "Manga",
        raw: item
      }));
  }, [data, limit]);

  // =========================
  // NAVIGATION
  // =========================
  const handleOpen = (item) => {
    if (!item?.raw) return;
    setSelectedStory?.(item.raw);
    setView?.("reader");

    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  if (!cleanData.length) return null;

  return (
    <div className="vertical-section-wrapper">
      
      {/* HEADER NET ET FIN */}
      <div className="section-header">
        <div className="header-left">
          <div 
            className="header-line" 
            style={{ 
              background: neonColor,
              boxShadow: `0 0 10px ${neonColor}` 
            }} 
          />
          <h2>{title}</h2>
        </div>
        <div className="header-right" style={{ color: neonColor }}>
          <Layers size={11} />
          <span>{cleanData.length}</span>
        </div>
      </div>

      {/* HORIZONTAL SCROLL DE TAILLE RÉDUITE */}
      <div className="section-scroll">
        {cleanData.map((item) => (
          <motion.div 
            key={item.id}
            className="manga-compact-card"
            whileTap={{ scale: 0.96 }}
            onClick={() => handleOpen(item)}
          >
            {/* BOÎTE IMAGE (Format 96x132 identique à Fables) */}
            <div className="manga-image-box">
              <img 
                src={item.cover} 
                alt={item.title}
                loading="lazy"
                draggable="false"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/300x450/111/222?text=Manga";
                }}
              />
              
              <div className="manga-overlay" />

              {/* PETIT BADGE DE CATÉGORIE CHIC */}
              <div className="manga-badge" style={{ background: neonColor }}>
                {item.genre}
              </div>

              {/* PETITE ICÔNE FLOTTANTE */}
              <div className="manga-mini-icon">
                <BookOpen size={10} />
              </div>
            </div>

            {/* INFOS COMPACTES */}
            <div className="manga-info-box">
              <h4>{item.title}</h4>
              <div className="manga-meta">
                <div className="manga-views" style={{ color: neonColor }}>
                  <Eye size={10} />
                  <span>{item.views}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* DESIGN APPLIQUÉ UNIQUEMENT À CE COMPOSANT */}
      <style>{`
        .vertical-section-wrapper {
          width: 100%;
          margin: 16px 0;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
          margin-bottom: 10px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-line {
          width: 4px;
          height: 15px;
          border-radius: 20px;
        }

        .section-header h2 {
          color: #fff;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: .3px;
          text-transform: uppercase;
          margin: 0;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 700;
        }

        .section-scroll {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding: 0 12px;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }

        .section-scroll::-webkit-scrollbar {
          display: none;
        }

        .manga-compact-card {
          width: 96px;
          flex-shrink: 0;
          cursor: pointer;
        }

        .manga-image-box {
          position: relative;
          width: 96px;
          height: 132px;
          overflow: hidden;
          border-radius: 14px;
          background: #111;
          border: 1px solid rgba(255, 255, 255, .04);
        }

        .manga-image-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
        }

        .manga-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
        }

        .manga-badge {
          position: absolute;
          top: 6px;
          left: 6px;
          padding: 2px 6px;
          border-radius: 6px;
          color: #000;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.2px;
        }

        .manga-mini-icon {
          position: absolute;
          bottom: 6px;
          right: 6px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
        }

        .manga-info-box {
          margin-top: 6px;
        }

        .manga-info-box h4 {
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 3px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .manga-meta {
          display: flex;
          align-items: center;
        }

        .manga-views {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 8px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
