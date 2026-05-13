import React, { useMemo, useState, useRef, useCallback } from "react";
import { PUBLIC_STORIES } from "../../../data/publicStories";
import { COMICCRAFTE_STORIES } from "../../../data/Action";
import { Eye, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HOLD_DELAY = 1000; // preview après 1 seconde

export default function TrendingScroll({
  setView,
  setSelectedStory,
  stories = [],
  type = "public",
}) {
  const [preview, setPreview] = useState(null);

  const holdTimer = useRef(null);
  const touchMoved = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);

  const data = useMemo(() => {
    const source =
      stories?.length > 0
        ? stories
        : type === "comicrafte"
        ? COMICCRAFTE_STORIES
        : PUBLIC_STORIES;

    return Array.isArray(source) ? source.slice(0, 12) : [];
  }, [stories, type]);

  const openStory = useCallback(
    (story) => {
      if (!story) return;

      setSelectedStory(story);
      setView("reader");
      setPreview(null);
    },
    [setSelectedStory, setView]
  );

  // =========================
  // TOUCH SYSTEM ULTRA FLUIDE
  // =========================

  const handleTouchStart = (e, story) => {
    touchMoved.current = false;

    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;

    holdTimer.current = setTimeout(() => {
      if (!touchMoved.current) {
        setPreview(story);
      }
    }, HOLD_DELAY);
  };

  const handleTouchMove = (e) => {
    const moveX = Math.abs(e.touches[0].clientX - startX.current);
    const moveY = Math.abs(e.touches[0].clientY - startY.current);

    // si l'utilisateur scroll → annule preview
    if (moveX > 10 || moveY > 10) {
      touchMoved.current = true;

      if (holdTimer.current) {
        clearTimeout(holdTimer.current);
      }
    }
  };

  const handleTouchEnd = (story) => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
    }

    // clic rapide = ouvrir
    if (!touchMoved.current && !preview) {
      openStory(story);
    }
  };

  return (
    <div className="trend-container">

      {/* HEADER */}
      <div className="trend-header">
        <div className="accent-bar" />

        <h2>
          {type === "comicrafte"
            ? "COMICCRAFTE ORIGINALS"
            : "CLASSIQUES GRATUITS"}
        </h2>
      </div>

      {/* SCROLL */}
      <div className="trend-scroll">

        {data.map((story) => (
          <motion.div
            key={story.id}
            className="trend-card"
            whileTap={{ scale: 0.96 }}
            onTouchStart={(e) => handleTouchStart(e, story)}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => handleTouchEnd(story)}
          >
            <img
              src={story.coverImage}
              alt={story.title}
              loading="lazy"
              draggable="false"
            />

            <div className="overlay">

              {story.badge && (
                <span className="badge">
                  {story.badge}
                </span>
              )}

              <div className="bottom-info">

                <h4>{story.title}</h4>

                <div className="meta">
                  <Eye size={10} />
                  <span>{story.viewsCount || "2.4k"}</span>
                </div>

              </div>
            </div>
          </motion.div>
        ))}

      </div>

      {/* PREVIEW */}
      <AnimatePresence>
        {preview && (
          <motion.div
            className="preview-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreview(null)}
          >

            <motion.div
              className="preview-box"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
            >

              <button
                className="close-btn"
                onClick={() => setPreview(null)}
              >
                <X size={18} />
              </button>

              <img
                src={preview.coverImage}
                alt={preview.title}
                className="preview-image"
              />

              <div className="preview-content">

                <h3>{preview.title}</h3>

                <p>
                  {preview.description?.slice(0, 90) || "Aucune description"}...
                </p>

                <button
                  className="read-btn"
                  onClick={() => openStory(preview)}
                >
                  Lire maintenant
                </button>

              </div>

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      <style>{`

        .trend-container{
          width:100%;
          margin:18px 0;
        }

        .trend-header{
          display:flex;
          align-items:center;
          gap:8px;
          padding:0 12px;
          margin-bottom:10px;
        }

        .accent-bar{
          width:4px;
          height:15px;
          border-radius:20px;
          background:#00ff88;
          box-shadow:0 0 10px #00ff88;
        }

        .trend-header h2{
          color:#fff;
          font-size:13px;
          font-weight:800;
          letter-spacing:.4px;
        }

        /* ================= */
        /* SCROLL PLUS FLUIDE */
        /* ================= */

        .trend-scroll{
          display:flex;
          gap:10px;
          overflow-x:auto;
          padding:0 12px;

          scroll-behavior:smooth;
          -webkit-overflow-scrolling:touch;

          scrollbar-width:none;
        }

        .trend-scroll::-webkit-scrollbar{
          display:none;
        }

        /* ================= */
        /* CARD COMPACT */
        /* ================= */

        .trend-card{
          position:relative;
          flex-shrink:0;

          width:96px;
          height:138px;

          border-radius:12px;
          overflow:hidden;

          background:#111;

          user-select:none;
          -webkit-user-select:none;

          transform:translateZ(0);
        }

        .trend-card img{
          width:100%;
          height:100%;
          object-fit:cover;
          pointer-events:none;
        }

        .overlay{
          position:absolute;
          inset:0;

          background:
          linear-gradient(
            to top,
            rgba(0,0,0,.95),
            rgba(0,0,0,.2) 45%,
            transparent
          );

          display:flex;
          flex-direction:column;
          justify-content:space-between;
        }

        .badge{
          align-self:flex-start;

          margin:6px;

          background:#00ff88;
          color:#000;

          font-size:8px;
          font-weight:800;

          padding:3px 6px;
          border-radius:20px;
        }

        .bottom-info{
          padding:8px;
        }

        .bottom-info h4{
          color:#fff;

          font-size:10px;
          font-weight:700;

          line-height:1.25;

          margin:0;

          display:-webkit-box;
          -webkit-line-clamp:2;
          -webkit-box-orient:vertical;
          overflow:hidden;
        }

        .meta{
          margin-top:5px;

          display:flex;
          align-items:center;
          gap:4px;

          color:#00ff88;
          font-size:9px;
          font-weight:600;
        }

        /* ================= */
        /* PREVIEW */
        /* ================= */

        .preview-overlay{
          position:fixed;
          inset:0;
          z-index:9999;

          background:rgba(0,0,0,.82);
          backdrop-filter:blur(10px);

          display:flex;
          align-items:center;
          justify-content:center;

          padding:20px;
        }

        .preview-box{
          width:100%;
          max-width:300px;

          background:#111;
          border:1px solid rgba(0,255,136,.15);

          border-radius:20px;
          overflow:hidden;

          box-shadow:
          0 0 25px rgba(0,255,136,.12);
        }

        .preview-image{
          width:100%;
          height:210px;
          object-fit:cover;
        }

        .preview-content{
          padding:14px;
        }

        .preview-content h3{
          color:#fff;
          font-size:18px;
          margin:0 0 8px;
        }

        .preview-content p{
          color:#aaa;
          font-size:12px;
          line-height:1.5;
          margin-bottom:15px;
        }

        .read-btn{
          width:100%;

          border:none;
          outline:none;

          background:#00ff88;
          color:#000;

          font-size:13px;
          font-weight:900;

          padding:12px;
          border-radius:12px;
        }

        .close-btn{
          position:absolute;
          top:10px;
          right:10px;

          width:34px;
          height:34px;

          border:none;
          border-radius:50%;

          background:rgba(0,0,0,.6);
          color:#fff;

          display:flex;
          align-items:center;
          justify-content:center;

          z-index:10;
        }

      `}</style>
    </div>
  );
}