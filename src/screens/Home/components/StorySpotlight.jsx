import React from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, Stars } from "lucide-react";

export function StorySpotlight({ 
  story, 
  setSelectedStory, 
  setView,
  label = "NOUVELLE DU JOUR" 
}) {
  
  if (!story) return null;

  const handleOpen = () => {
    setSelectedStory?.(story);
    setView?.("reader");
  };

  return (
    <div className="spotlight-wrapper">
      <div className="spotlight-label">
        <Stars size={14} color="#00ff88" />
        <span>{label}</span>
      </div>

      <motion.div 
        className="spotlight-card"
        whileTap={{ scale: 0.98 }}
        onClick={handleOpen}
      >
        <img 
          src={story.coverImage || story.cover} 
          alt={story.title} 
          className="spotlight-img"
        />
        
        <div className="spotlight-content">
          <div className="text-info">
            <h3>{story.title}</h3>
            <p>{story.description?.substring(0, 60)}...</p>
          </div>
          
          <div className="read-btn">
            <BookOpen size={14} />
            <span>Lire</span>
            <ChevronRight size={14} />
          </div>
        </div>
      </motion.div>

      <style>{`
        .spotlight-wrapper {
          padding: 0 15px;
          margin: 20px 0;
        }

        .spotlight-label {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 10px;
          color: #00ff88;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .spotlight-card {
          position: relative;
          width: 100%;
          height: 160px;
          border-radius: 20px;
          overflow: hidden;
          background: #111;
          display: flex;
          align-items: center;
          border: 1px solid rgba(0, 255, 136, 0.2);
        }

        .spotlight-img {
          width: 40%;
          height: 100%;
          object-fit: cover;
        }

        .spotlight-content {
          width: 60%;
          padding: 15px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          background: linear-gradient(90deg, #111 0%, #050505 100%);
        }

        .text-info h3 {
          color: #fff;
          font-size: 16px;
          font-weight: 800;
          margin: 0 0 5px 0;
        }

        .text-info p {
          color: #999;
          font-size: 11px;
          line-height: 1.4;
          margin: 0;
        }

        .read-btn {
          align-self: flex-start;
          display: flex;
          align-items: center;
          gap: 5px;
          background: #00ff88;
          color: #000;
          padding: 6px 12px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 800;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}
