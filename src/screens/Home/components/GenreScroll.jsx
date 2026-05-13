import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Sparkles,
  Ghost,
  Heart,
  Swords,
  Brain,
  Crown,
  Rocket,
  Skull,
  Drama,
  Laugh,
  Eye
} from "lucide-react";

import { COMICCRAFTE_STORIES } from "../../../data/COMICCRAFTE_DATA";
import { PUBLIC_STORIES } from "../../../data/publicStories";

export default function GenreExplorer({
  setView,
  setSelectedStory
}) {

  // =========================
  // ALL STORIES
  // =========================

  const allStories = useMemo(() => {
    return [
      ...(COMICCRAFTE_STORIES || []),
      ...(PUBLIC_STORIES || [])
    ];
  }, []);

  // =========================
  // GENRES
  // =========================

  const genres = [
    { name: "Tout", icon: Flame },

    { name: "Action", icon: Swords },
    { name: "Drama", icon: Drama },
    { name: "Fantastique", icon: Sparkles },
    { name: "Comédie", icon: Laugh },
    { name: "Romance", icon: Heart },
    { name: "Horreur", icon: Ghost },
    { name: "Mystère", icon: Eye },
    { name: "Psychologique", icon: Brain },
    { name: "Sci-Fi", icon: Rocket },
    { name: "Dark", icon: Skull },

    // +25 GENRES
    { name: "Aventure", icon: Flame },
    { name: "Thriller", icon: Flame },
    { name: "Super Pouvoir", icon: Flame },
    { name: "Arts Martiaux", icon: Flame },
    { name: "Réincarnation", icon: Flame },
    { name: "Isekai", icon: Flame },
    { name: "School Life", icon: Flame },
    { name: "Fantasy", icon: Flame },
    { name: "Webtoon", icon: Flame },
    { name: "Historique", icon: Crown },
    { name: "Post-Apo", icon: Flame },
    { name: "Cyberpunk", icon: Flame },
    { name: "Survie", icon: Flame },
    { name: "Zombie", icon: Flame },
    { name: "Démon", icon: Flame },
    { name: "Magie", icon: Flame },
    { name: "Tragédie", icon: Flame },
    { name: "Slice Of Life", icon: Flame },
    { name: "Seinen", icon: Flame },
    { name: "Shonen", icon: Flame },
    { name: "Josei", icon: Flame },
    { name: "Manhwa", icon: Flame },
    { name: "Manhua", icon: Flame },
    { name: "Crime", icon: Flame },
    { name: "Militaire", icon: Flame },
    { name: "Apocalypse", icon: Flame },
    { name: "Monstres", icon: Flame },
    { name: "Overpowered", icon: Flame },
    { name: "Villain", icon: Flame },
    { name: "Ninja", icon: Flame },
  ];

  // =========================
  // STATES
  // =========================

  const [activeGenre, setActiveGenre] = useState("Tout");
  const [showMessage, setShowMessage] = useState(false);

  const scrollRef = useRef(null);

  // =========================
  // FILTER
  // =========================

  const filteredStories = useMemo(() => {

    if (activeGenre === "Tout") {
      return allStories.slice(0, 15);
    }

    const result = allStories.filter((story) =>
      story?.genres?.some(
        (g) =>
          g.toLowerCase() === activeGenre.toLowerCase()
      )
    );

    return result;

  }, [activeGenre, allStories]);

  // =========================
  // HANDLE GENRE
  // =========================

  const handleGenre = (genre) => {

    setActiveGenre(genre);

    const exists = allStories.some((story) =>
      story?.genres?.some(
        (g) => g.toLowerCase() === genre.toLowerCase()
      )
    );

    setShowMessage(!exists);

    setTimeout(() => {
      setShowMessage(false);
    }, 2500);
  };

  // =========================
  // OPEN STORY
  // =========================

  const openStory = (story) => {
    setSelectedStory?.(story);
    setView?.("reader");
  };

  return (
    <div className="genre-wrapper">

      {/* HEADER */}

      <div className="genre-header">

        <div className="left">

          <div className="line" />

          <h2>Explorer les genres</h2>

        </div>

        <span className="genre-count">
          {filteredStories.length}
        </span>

      </div>

      {/* GENRES */}

      <div className="genre-scroll">

        {genres.map((genre) => {

          const Icon = genre.icon;

          const active = activeGenre === genre.name;

          return (
            <motion.button
              key={genre.name}
              whileTap={{ scale: 0.94 }}
              onClick={() => handleGenre(genre.name)}
              className={`genre-btn ${active ? "active" : ""}`}
            >

              <Icon size={13} />

              <span>{genre.name}</span>

            </motion.button>
          );
        })}

      </div>

      {/* MESSAGE */}

      <AnimatePresence>
        {showMessage && (
          <motion.div
            className="coming-box"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Ce type d’histoire sera bientôt ajouté sur la plateforme.
          </motion.div>
        )}
      </AnimatePresence>

      {/* STORIES */}

      <div
        ref={scrollRef}
        className="stories-scroll"
      >

        {filteredStories.map((story) => (

          <motion.div
            key={story.id}
            className="story-card"
            whileTap={{ scale: 0.96 }}
            onClick={() => openStory(story)}
          >

            <div className="image-box">

              <img
                src={story.coverImage}
                alt={story.title}
                loading="lazy"
                draggable="false"
              />

              <div className="image-overlay" />

            </div>

            <div className="story-info">

              <h4>{story.title}</h4>

              <span>
                {story.viewsCount || "2.5k"} vues
              </span>

            </div>

          </motion.div>

        ))}

      </div>

      <style>{`

        .genre-wrapper{
          width:100%;
          margin:14px 0;
        }

        /* ================= */
        /* HEADER */
        /* ================= */

        .genre-header{
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
          border-radius:30px;

          background:#00ff88;

          box-shadow:0 0 12px #00ff88;
        }

        .genre-header h2{
          color:#fff;
          font-size:14px;
          font-weight:800;
        }

        .genre-count{
          color:#00ff88;
          font-size:11px;
          font-weight:700;
        }

        /* ================= */
        /* GENRES */
        /* ================= */

        .genre-scroll{
          display:flex;
          gap:8px;

          overflow-x:auto;

          padding:0 12px 12px;

          scrollbar-width:none;

          scroll-behavior:smooth;
          -webkit-overflow-scrolling:touch;
        }

        .genre-scroll::-webkit-scrollbar{
          display:none;
        }

        .genre-btn{
          border:none;
          outline:none;

          display:flex;
          align-items:center;
          gap:5px;

          flex-shrink:0;

          padding:8px 14px;

          border-radius:999px;

          background:#1a1a1a;
          color:#999;

          font-size:11px;
          font-weight:700;

          transition:.2s;
        }

        .genre-btn.active{
          background:#00ff88;
          color:#000;

          box-shadow:
          0 0 18px rgba(0,255,136,.35);
        }

        /* ================= */
        /* MESSAGE */
        /* ================= */

        .coming-box{
          margin:0 12px 12px;

          background:rgba(0,255,136,.08);

          border:1px solid rgba(0,255,136,.15);

          color:#00ff88;

          font-size:11px;
          font-weight:600;

          padding:10px 12px;

          border-radius:12px;
        }

        /* ================= */
        /* STORIES */
        /* ================= */

        .stories-scroll{
          display:flex;
          gap:10px;

          overflow-x:auto;

          padding:0 12px;

          scrollbar-width:none;

          scroll-behavior:smooth;
          -webkit-overflow-scrolling:touch;
        }

        .stories-scroll::-webkit-scrollbar{
          display:none;
        }

        /* ================= */
        /* CARD */
        /* ================= */

        .story-card{
          width:102px;
          flex-shrink:0;
        }

        .image-box{
          position:relative;

          width:102px;
          height:138px;

          border-radius:14px;
          overflow:hidden;

          background:#111;
        }

        .image-box img{
          width:100%;
          height:100%;

          object-fit:cover;

          pointer-events:none;
        }

        .image-overlay{
          position:absolute;
          inset:0;

          background:
          linear-gradient(
            to top,
            rgba(0,0,0,.55),
            transparent
          );
        }

        .story-info{
          margin-top:7px;
        }

        .story-info h4{
          color:#fff;

          font-size:11px;
          font-weight:700;

          line-height:1.3;

          margin:0 0 3px;

          display:-webkit-box;
          -webkit-line-clamp:2;
          -webkit-box-orient:vertical;

          overflow:hidden;
        }

        .story-info span{
          color:#00ff88;

          font-size:9px;
          font-weight:600;
        }

      `}</style>

    </div>
  );
}