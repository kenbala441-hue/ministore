// src/components/SplashScreen.jsx

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ finishLoading }) {
  const [visible, setVisible] = useState(true);
  const [loadingText, setLoadingText] = useState("Synchronisation de l'univers...");

  const finalText = "COMICCRAFTE";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const [displayText, setDisplayText] = useState("");

  // 🔥 TEXT SCRAMBLE
  useEffect(() => {
    let iteration = 0;

    const interval = setInterval(() => {
      setDisplayText(
        finalText
          .split("")
          .map((letter, index) => {
            if (index < iteration) return finalText[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= finalText.length) {
        clearInterval(interval);
      }

      iteration += 0.5;
    }, 35);

    return () => clearInterval(interval);
  }, []);

  // 🔥 LOADING TEXT ROTATION
  useEffect(() => {
    const texts = [
      "Synchronisation de l'univers...",
      "Connexion aux dimensions créatives...",
      "Chargement des histoires premium...",
      "Préparation de votre expérience..."
    ];

    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % texts.length;
      setLoadingText(texts[index]);
    }, 1300);

    return () => clearInterval(interval);
  }, []);

  // 🔥 AUTO CLOSE
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);

      setTimeout(() => {
        finishLoading?.();
      }, 700);
    }, 5200);

    return () => clearTimeout(timer);
  }, [finishLoading]);

  // 🌌 PARTICLES
  const particles = useMemo(() => {
    return Array.from({ length: 70 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 8 + 5
    }));
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.08,
            filter: "blur(12px)"
          }}
          transition={{ duration: 0.9 }}
          style={s.container}
        >
          {/* 🔥 BACKGROUND */}
          <div style={s.background}>
            <div style={s.overlay} />
            <div style={s.grid} />
            <div style={s.redGlow} />
            <div style={s.blueGlow} />
            <div style={s.centerGlow} />

            {/* PARTICLES */}
            {particles.map((p, i) => (
              <motion.div
                key={i}
                style={{
                  ...s.particle,
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  width: p.size,
                  height: p.size
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity
                }}
              />
            ))}
          </div>

          {/* 🔥 MAIN CONTENT */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 20
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            transition={{
              duration: 1,
              ease: "easeOut"
            }}
            style={s.content}
          >
            {/* LOGO */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 30px rgba(255,0,85,0.4)",
                  "0 0 90px rgba(0,247,255,0.5)",
                  "0 0 30px rgba(255,0,85,0.4)"
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity
              }}
              style={s.logo}
            >
              <motion.div
                animate={{
                  rotate: [0, 2, -2, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity
                }}
                style={s.logoInner}
              >
                C
              </motion.div>
            </motion.div>

            {/* TITLE */}
            <h1 style={s.title}>
              {displayText.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{
                    opacity: 0,
                    y: 20,
                    filter: "blur(10px)"
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)"
                  }}
                  transition={{
                    delay: i * 0.04,
                    duration: 0.45
                  }}
                  style={s.char}
                >
                  {char}
                </motion.span>
              ))}
            </h1>

            {/* SUBTITLE */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              style={s.subtitle}
            >
              ENTER THE CREATIVE MULTIVERSE
            </motion.p>

            {/* STATUS */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              style={s.statusBox}
            >
              <div style={s.liveDot} />

              <span style={s.statusText}>
                {loadingText}
              </span>
            </motion.div>

            {/* PROGRESS */}
            <div style={s.progressContainer}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 5,
                  ease: "linear"
                }}
                style={s.progress}
              />
            </div>

            {/* DOTS */}
            <div style={s.dots}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  style={s.dot}
                  animate={{
                    scale: [1, 1.7, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const s = {
  container: {
    position: "fixed",
    inset: 0,
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    background: "#02040a",
    zIndex: 999999,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Inter', 'Segoe UI', sans-serif"
  },

  background: {
    position: "absolute",
    inset: 0
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.85))"
  },

  grid: {
    position: "absolute",
    inset: "-50%",
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "55px 55px",
    transform: "perspective(1000px) rotateX(75deg)",
    animation: "gridMove 16s linear infinite"
  },

  redGlow: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "#ff004c",
    filter: "blur(160px)",
    top: "-10%",
    left: "-10%",
    opacity: 0.25
  },

  blueGlow: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "#00e1ff",
    filter: "blur(180px)",
    bottom: "-10%",
    right: "-10%",
    opacity: 0.2
  },

  centerGlow: {
    position: "absolute",
    width: "700px",
    height: "700px",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)",
    filter: "blur(90px)",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },

  particle: {
    position: "absolute",
    borderRadius: "50%",
    background: "#fff",
    opacity: 0.4
  },

  content: {
    position: "relative",
    zIndex: 3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px"
  },

  logo: {
    width: "110px",
    height: "110px",
    borderRadius: "32px",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(15px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "30px"
  },

  logoInner: {
    width: "82px",
    height: "82px",
    borderRadius: "24px",
    background:
      "linear-gradient(135deg,#ff004c 0%, #7b2cff 45%, #00e1ff 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontSize: "42px",
    fontWeight: "900",
    textShadow: "0 0 30px rgba(255,255,255,0.6)"
  },

  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "900",
    letterSpacing: "6px",
    color: "#fff",
    textAlign: "center"
  },

  char: {
    display: "inline-block",
    textShadow: "0 0 20px rgba(255,255,255,0.25)"
  },

  subtitle: {
    marginTop: "12px",
    color: "rgba(255,255,255,0.6)",
    fontSize: "11px",
    letterSpacing: "5px",
    fontWeight: "700"
  },

  statusBox: {
    marginTop: "30px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 18px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)"
  },

  liveDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#00ff9d",
    boxShadow: "0 0 15px #00ff9d"
  },

  statusText: {
    color: "#d9d9d9",
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.5px"
  },

  progressContainer: {
    width: "240px",
    height: "4px",
    borderRadius: "999px",
    overflow: "hidden",
    background: "rgba(255,255,255,0.08)",
    marginTop: "28px"
  },

  progress: {
    height: "100%",
    borderRadius: "999px",
    background:
      "linear-gradient(90deg,#ff004c 0%, #7b2cff 50%, #00e1ff 100%)",
    boxShadow: "0 0 20px rgba(0,225,255,0.45)"
  },

  dots: {
    display: "flex",
    gap: "8px",
    marginTop: "18px"
  },

  dot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#fff"
  }
};

if (typeof document !== "undefined") {
  const style = document.createElement("style");

  style.innerHTML = `
    @keyframes gridMove {
      0% {
        transform: perspective(1000px) rotateX(75deg) translateY(0px);
      }

      100% {
        transform: perspective(1000px) rotateX(75deg) translateY(55px);
      }
    }
  `;

  document.head.appendChild(style);
}