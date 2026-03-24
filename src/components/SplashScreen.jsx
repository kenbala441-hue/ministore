// src/components/SplashScreen.jsx

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ finishLoading }) {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);

  // 🔥 TEXTE ANIMATION (SCRAMBLE EFFECT)
  const finalText = "ComicCrafte Studio";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let iteration = 0;

    const interval = setInterval(() => {
      setDisplayText(
        finalText
          .split("")
          .map((char, index) => {
            if (index < iteration) return finalText[index];
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("")
      );

      if (iteration >= finalText.length) clearInterval(interval);

      iteration += 1 / 2;
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // 🌌 PARTICULES
  const particles = useMemo(() => {
    return Array.from({ length: 80 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: 4 + Math.random() * 6,
      size: Math.random() * 2 + 1
    }));
  }, []);

  // 🌌 CONSTELLATION LINES
  const lines = useMemo(() => {
    return Array.from({ length: 25 }).map(() => ({
      x1: Math.random() * 100,
      y1: Math.random() * 100,
      x2: Math.random() * 100,
      y2: Math.random() * 100
    }));
  }, []);

  // 🌠 SHOOTING STARS
  const shootingStars = useMemo(() => {
    return Array.from({ length: 6 }).map(() => ({
      top: Math.random() * 100,
      delay: Math.random() * 5
    }));
  }, []);

  // 🔄 ORBITS
  const orbitLogos = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      size: 15 + Math.random() * 15,
      duration: 6 + i
    }));
  }, []);

  // ⏱ TIMING FIX (ANTI BUG)
  useEffect(() => {
    const t1 = setTimeout(() => setLoading(false), 3000);
    const t2 = setTimeout(() => {
      setVisible(false);
      finishLoading();
    }, 6000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [finishLoading]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={s.container}
        >
          {/* 🌌 BACKGROUND */}
          <div style={s.bg}>
            <div style={s.grid} />
            <div style={s.gradient} />
            <div style={s.nebula1} />
            <div style={s.nebula2} />

            {/* CONSTELLATION */}
            <svg style={s.svg}>
              {lines.map((l, i) => (
                <motion.line
                  key={i}
                  x1={`${l.x1}%`}
                  y1={`${l.y1}%`}
                  x2={`${l.x2}%`}
                  y2={`${l.y2}%`}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                  animate={{ opacity: [0.1, 0.5, 0.1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              ))}
            </svg>
          </div>

          {/* ✨ PARTICLES */}
          <div style={s.particles}>
            {particles.map((p, i) => (
              <motion.div
                key={i}
                style={{
                  ...s.particle,
                  top: `${p.top}%`,
                  left: `${p.left}%`,
                  width: p.size,
                  height: p.size
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0.2, 1, 0.2]
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity
                }}
              />
            ))}
          </div>

          {/* 🌠 SHOOTING STARS */}
          {shootingStars.map((sht, i) => (
            <motion.div
              key={i}
              style={{
                ...s.shootingStar,
                top: `${sht.top}%`
              }}
              animate={{
                x: ["-10%", "110%"],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1.5,
                delay: sht.delay,
                repeat: Infinity
              }}
            />
          ))}

          {/* 🔄 ORBIT */}
          <div style={s.orbit}>
            {orbitLogos.map((o, i) => (
              <motion.div
                key={i}
                style={{
                  ...s.orbitItem,
                  width: o.size,
                  height: o.size
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: o.duration,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div style={s.smallLogo}>C</div>
              </motion.div>
            ))}
          </div>

          {/* 🚀 LOGO */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            style={s.center}
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 10px #ff0055",
                  "0 0 30px #00f7ff",
                  "0 0 10px #ff0055"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={s.logo}
            >
              C
            </motion.div>

            <h1 style={s.title}>
              {displayText.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  {char}
                </motion.span>
              ))}
            </h1>
          </motion.div>

          {/* ⚡ LOADER */}
          <div style={s.loader}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: loading ? "70%" : "100%" }}
              transition={{ duration: 3 }}
              style={s.progress}
            />
          </div>

          {/* 🔵 DOTS */}
          <div style={s.dots}>
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                style={s.dot}
                animate={{ y: [0, -8, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>

          {/* TEXT */}
          <motion.p style={s.text}>
            {loading
              ? "Initialisation du système..."
              : "Connexion à votre univers..."}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const s = {
  container: {
    position: "fixed",
    width: "100vw",
    height: "100vh",
    background: "#02030a",
    zIndex: 9999,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },

  bg: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },

  grid: {
    position: "absolute",
    width: "200%",
    height: "200%",
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "60px 60px",
    animation: "gridMove 30s linear infinite"
  },

  gradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background:
      "radial-gradient(circle at 20% 20%, #ff0055 0%, transparent 40%), radial-gradient(circle at 80% 80%, #00f7ff 0%, transparent 40%)",
    filter: "blur(120px)",
    opacity: 0.3
  },

  nebula1: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "#ff0055",
    filter: "blur(150px)",
    opacity: 0.2
  },

  nebula2: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "#00f7ff",
    filter: "blur(150px)",
    bottom: 0,
    right: 0,
    opacity: 0.2
  },

  svg: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },

  particles: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },

  particle: {
    position: "absolute",
    background: "#fff",
    borderRadius: "50%"
  },

  shootingStar: {
    position: "absolute",
    width: "150px",
    height: "2px",
    background: "linear-gradient(90deg, #fff, transparent)"
  },

  orbit: {
    position: "absolute",
    width: "250px",
    height: "250px"
  },

  orbitItem: {
    position: "absolute",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  smallLogo: {
    color: "#00f7ff",
    fontSize: "10px"
  },

  center: {
    zIndex: 2,
    textAlign: "center"
  },

  logo: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    border: "2px solid #ff0055",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "30px",
    color: "#ff0055",
    marginBottom: "15px"
  },

  title: {
    color: "#fff",
    fontSize: "20px",
    letterSpacing: "3px"
  },

  loader: {
    width: "180px",
    height: "5px",
    background: "rgba(255,255,255,0.1)",
    marginTop: "20px",
    borderRadius: "10px",
    overflow: "hidden"
  },

  progress: {
    height: "100%",
    background: "linear-gradient(90deg,#ff0055,#00f7ff,#ff00ff)"
  },

  dots: {
    display: "flex",
    gap: "8px",
    marginTop: "10px"
  },

  dot: {
    width: "6px",
    height: "6px",
    background: "#ff0055",
    borderRadius: "50%"
  },

  text: {
    marginTop: "15px",
    color: "rgba(255,255,255,0.7)",
    fontSize: "13px"
  }
};

// GRID ANIMATION
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes gridMove {
      0% { transform: translate(0,0); }
      100% { transform: translate(-60px,-60px); }
    }
  `;
  document.head.appendChild(style);
}