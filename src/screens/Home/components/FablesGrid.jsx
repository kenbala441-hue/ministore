import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  BookOpen,
  Eye,
  Crown,
  Flame
} from "lucide-react";

export function FablesGrid({
  fables = [],
  fallbackData = [],
  setSelectedStory,
  setView,
  neonColor = "#ffd300",
  limit = 15
}) {

  // =========================
  // SAFE DATA
  // =========================

  const data = useMemo(() => {

    const src =
      Array.isArray(fables) && fables.length > 0
        ? fables
        : fallbackData;

    if (!Array.isArray(src)) return [];

    return src
      .filter(Boolean)
      .slice(0, limit)
      .map((item, index) => ({
        id: item?.id || `fable-${index}`,

        title:
          item?.title ||
          "Fable inconnue",

        cover:
          item?.coverImage ||
          item?.cover ||
          item?.pages?.[0]?.src ||
          "https://via.placeholder.com/300x450/111/222?text=Fable",

        views:
          item?.viewsCount ||
          `${Math.floor(Math.random() * 9 + 1)}.${Math.floor(Math.random() * 9)}k`,

        badge:
          item?.badge ||
          ["Nouveau", "Top", "Populaire", "Zen"][
            Math.floor(Math.random() * 4)
          ],

        raw: item
      }));

  }, [fables, fallbackData, limit]);

  // =========================
  // OPEN STORY
  // =========================

  const handleOpen = (item) => {

    if (!item?.raw) return;

    setSelectedStory?.(item.raw);
    setView?.("reader");

    try {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  if (!data.length) return null;

  return (
    <div className="fables-wrapper">

      {/* HEADER */}

      <div className="fables-header">

        <div className="left">

          <div
            className="line"
            style={{
              background: neonColor,
              boxShadow: `0 0 12px ${neonColor}`
            }}
          />

          <h2>
            Fables & Sagesse
          </h2>

        </div>

        <div className="right">

          <Sparkles size={12} />

          <span>{data.length}</span>

        </div>

      </div>

      {/* SCROLL */}

      <div className="fables-scroll">

        {data.map((item) => (

          <motion.div
            key={item.id}
            className="fable-card"
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpen(item)}
          >

            {/* IMAGE */}

            <div className="image-box">

              <img
                src={item.cover}
                alt={item.title}
                loading="lazy"
                draggable="false"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/300x450/111/222?text=Fable";
                }}
              />

              {/* OVERLAY */}

              <div className="overlay" />

              {/* BADGE */}

              <div
                className="badge"
                style={{
                  background: neonColor,
                }}
              >
                {item.badge}
              </div>

              {/* MINI ICON */}

              <div className="mini-icon">

                <BookOpen size={11} />

              </div>

            </div>

            {/* INFO */}

            <div className="info">

              <h4>{item.title}</h4>

              <div className="meta">

                <div className="views">

                  <Eye size={10} />

                  <span>{item.views}</span>

                </div>

                <div className="type">

                  <Crown size={10} />

                  <span>Fable</span>

                </div>

              </div>

            </div>

          </motion.div>

        ))}

      </div>

      <style>{`

        .fables-wrapper{
          width:100%;
          margin:14px 0;
        }

        /* ================= */
        /* HEADER */
        /* ================= */

        .fables-header{
          display:flex;
          align-items:center;
          justify-content:space-between;

          padding:0 12px;
          margin-bottom:10px;
        }

        .left{
          display:flex;
          align-items:center;
          gap:8px;
        }

        .line{
          width:4px;
          height:15px;
          border-radius:20px;
        }

        .fables-header h2{
          color:#fff;
          font-size:13px;
          font-weight:800;
          letter-spacing:.3px;
        }

        .right{
          display:flex;
          align-items:center;
          gap:4px;

          color:${neonColor};

          font-size:10px;
          font-weight:700;
        }

        /* ================= */
        /* SCROLL */
        /* ================= */

        .fables-scroll{
          display:flex;
          gap:10px;

          overflow-x:auto;

          padding:0 12px;

          scrollbar-width:none;

          scroll-behavior:smooth;
          -webkit-overflow-scrolling:touch;
        }

        .fables-scroll::-webkit-scrollbar{
          display:none;
        }

        /* ================= */
        /* CARD */
        /* ================= */

        .fable-card{
          width:96px;
          flex-shrink:0;
        }

        .image-box{
          position:relative;

          width:96px;
          height:132px;

          overflow:hidden;
          border-radius:14px;

          background:#111;

          border:
          1px solid rgba(255,255,255,.04);
        }

        .image-box img{
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
            rgba(0,0,0,.9),
            rgba(0,0,0,.1)
          );
        }

        /* ================= */
        /* BADGE */
        /* ================= */

        .badge{
          position:absolute;
          top:6px;
          left:6px;

          padding:3px 6px;

          border-radius:999px;

          color:#000;

          font-size:7px;
          font-weight:900;
        }

        .mini-icon{
          position:absolute;
          bottom:6px;
          right:6px;

          width:22px;
          height:22px;

          border-radius:50%;

          background:rgba(0,0,0,.65);
          color:#fff;

          display:flex;
          align-items:center;
          justify-content:center;

          backdrop-filter:blur(4px);
        }

        /* ================= */
        /* INFO */
        /* ================= */

        .info{
          margin-top:7px;
        }

        .info h4{
          color:#fff;

          font-size:10px;
          font-weight:700;

          line-height:1.3;

          margin:0 0 5px;

          display:-webkit-box;
          -webkit-line-clamp:2;
          -webkit-box-orient:vertical;

          overflow:hidden;
        }

        .meta{
          display:flex;
          align-items:center;
          justify-content:space-between;
        }

        .views,
        .type{
          display:flex;
          align-items:center;
          gap:3px;

          color:#999;

          font-size:8px;
          font-weight:600;
        }

        .views{
          color:${neonColor};
        }

      `}</style>

    </div>
  );
}