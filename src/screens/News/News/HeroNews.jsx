import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronRight,
  Clock3,
} from "lucide-react";

const HeroNews = () => {
  const [currentImg, setCurrentImg] = useState(0);

  const ads = [
    {
      url: "https://res.cloudinary.com/dn9c4ctav/image/upload/v1772150811/1762552814369_tdmwse.png",
      title: "Les Héritiers de l'Oubli",
      subtitle: "Nouvelle série dark fantasy disponible bientôt",
      tag: "NOUVEAU",
    },

    {
      url: "https://picsum.photos/800/400?sig=2",
      title: "Concours de Dessin",
      subtitle: "Participez aux événements ComicCrafte",
      tag: "EVENT",
    },

    {
      url: "https://res.cloudinary.com/dn9c4ctav/image/upload/v1774630505/1774630494659_gzve7l.png",
      title: "Blackline — Chapitre 15",
      subtitle: "Le nouveau chapitre arrive cette semaine",
      tag: "UPDATE",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % ads.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [ads.length]);

  return (
    <section style={s.wrapper}>
      <div style={s.container}>
        {/* IMAGE */}
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImg}
            src={ads[currentImg].url}
            alt={ads[currentImg].title}
            style={s.img}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>

        {/* OVERLAY */}
        <div style={s.overlay} />

        {/* TOP BADGE */}
        <div style={s.topBadge}>
          <Sparkles size={9} />
          <span>{ads[currentImg].tag}</span>
        </div>

        {/* CONTENT */}
        <div style={s.content}>
          <div style={s.bottom}>
            <div style={s.left}>
              <div style={s.liveRow}>
                <Clock3 size={9} />
                <span>ComicCrafte News</span>
              </div>

              <h2 style={s.title}>
                {ads[currentImg].title}
              </h2>

              <p style={s.subtitle}>
                {ads[currentImg].subtitle}
              </p>
            </div>

            <div style={s.actionBtn}>
              <ChevronRight size={16} />
            </div>
          </div>

          {/* DOTS */}
          <div style={s.dots}>
            {ads.map((_, index) => (
              <div
                key={index}
                style={{
                  ...s.dot,
                  width: currentImg === index ? "18px" : "5px",
                  background:
                    currentImg === index
                      ? "#fff"
                      : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </div>
        </div>

        {/* GLOW */}
        <div style={s.glow} />
      </div>
    </section>
  );
};

export default HeroNews;

const s = {
  wrapper: {
    padding: "14px 14px 8px",
  },

  container: {
    height: "165px",
    borderRadius: "24px",
    overflow: "hidden",
    position: "relative",
    background: "#0a0d16",
    border: "1px solid rgba(255,255,255,0.05)",
    boxShadow: "0 15px 45px rgba(0,0,0,0.35)",
  },

  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
    inset: 0,
    filter: "brightness(0.72)",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(4,6,12,0.95), rgba(4,6,12,0.25), transparent)",
    zIndex: 1,
  },

  topBadge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    zIndex: 3,
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "5px 9px",
    borderRadius: "999px",
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "0.8px",
  },

  content: {
    position: "absolute",
    inset: 0,
    zIndex: 2,
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  bottom: {
    marginTop: "auto",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "12px",
  },

  left: {
    flex: 1,
    minWidth: 0,
  },

  liveRow: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    color: "#00e0ff",
    fontSize: "8px",
    fontWeight: "700",
    marginBottom: "6px",
    letterSpacing: "0.5px",
  },

  title: {
    color: "#fff",
    fontSize: "17px",
    fontWeight: "900",
    margin: "0 0 4px",
    lineHeight: 1.15,
    textShadow: "0 3px 12px rgba(0,0,0,0.45)",
  },

  subtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: "10px",
    lineHeight: 1.45,
    margin: 0,
    maxWidth: "92%",
  },

  actionBtn: {
    width: "34px",
    minWidth: "34px",
    height: "34px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, rgba(0,224,255,0.18), rgba(122,92,255,0.18))",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#fff",
    backdropFilter: "blur(12px)",
  },

  dots: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },

  dot: {
    height: "5px",
    borderRadius: "999px",
    transition: "0.3s",
  },

  glow: {
    position: "absolute",
    width: "180px",
    height: "180px",
    background:
      "radial-gradient(circle, rgba(122,92,255,0.22), transparent)",
    right: "-60px",
    bottom: "-80px",
    filter: "blur(30px)",
    zIndex: 0,
  },
};