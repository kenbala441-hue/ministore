import React, { useMemo } from "react";
import { motion } from "framer-motion";

const NEON_COLORS = ["#ff003c", "#00f7ff", "#ff00ff", "#39ff14", "#ffd300", "#8f00ff"];

export default function NewsCard({ news, setView, setSelectedStory }) {

  // 🎨 Couleur dynamique stable
  const neonColor = useMemo(() => {
    return NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
  }, []);

  // 🎯 Navigation propre
  const handleClick = () => {
    if (!news) return;
    setSelectedStory?.(news);
    setView("reader");
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      style={{
        borderRadius: "14px",
        overflow: "hidden",
        marginBottom: "15px",
        cursor: "pointer",
        border: `1px solid ${neonColor}55`,
        background: "#0b0b0b",
        width: "100%",
        boxShadow: `0 0 15px ${neonColor}22`,
        position: "relative"
      }}
    >

      {/* IMAGE + OVERLAY */}
      <div style={{ position: "relative" }}>
        <img
          src={news?.cover || news?.coverImage || "/placeholder-cover.jpg"}
          alt={news?.title}
          loading="lazy"
          style={{
            width: "100%",
            height: "130px",
            objectFit: "cover",
            display: "block"
          }}
        />

        {/* OVERLAY GRADIENT */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60%",
          background: "linear-gradient(transparent, rgba(0,0,0,0.9))"
        }} />

        {/* BADGES */}
        {news?.isPremium && (
          <div style={{
            position: "absolute",
            top: "6px",
            right: "6px",
            background: "#000",
            color: "#fff",
            fontSize: "9px",
            fontWeight: "900",
            padding: "3px 6px",
            borderRadius: "6px",
            border: `1px solid ${neonColor}`
          }}>
            🔒 PREMIUM
          </div>
        )}

        {news?.isNew && (
          <div style={{
            position: "absolute",
            top: "6px",
            left: "6px",
            background: neonColor,
            color: "#000",
            fontSize: "9px",
            fontWeight: "900",
            padding: "3px 6px",
            borderRadius: "6px"
          }}>
            NEW
          </div>
        )}
      </div>

      {/* CONTENU */}
      <div style={{ padding: "10px" }}>
        <h4 style={{
          margin: "0 0 6px 0",
          color: neonColor,
          fontSize: "13px",
          fontWeight: "800",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
        }}>
          {news?.title || "Titre inconnu"}
        </h4>

        {/* GENRES */}
        <p style={{
          margin: 0,
          color: "#888",
          fontSize: "10px",
          fontStyle: "italic"
        }}>
          {news?.genres?.join(", ") || "Genre inconnu"}
        </p>

        {/* STATS */}
        <div style={{
          display: "flex",
          gap: "10px",
          marginTop: "6px",
          fontSize: "10px",
          fontWeight: "700"
        }}>
          <span style={{ color: neonColor }}>
            👁 {news?.views || news?.viewsCount || 0}
          </span>
          <span style={{ color: "#ff003c" }}>
            ❤️ {news?.likes || news?.likesCount || 0}
          </span>
        </div>
      </div>
    </motion.div>
  );
}