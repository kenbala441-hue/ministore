import React, { useEffect, useState, Suspense, lazy } from "react";
import { motion } from "framer-motion";

// Lazy load des composants si besoin
// const SomeComponent = lazy(() => import("./SomeComponent"));

export default function SplashScreen({ finishLoading }) {
  const [loadingDependencies, setLoadingDependencies] = useState(true);

  // Simule le chargement de dépendances (ou 0 si rien)
  useEffect(() => {
    const loadDependencies = async () => {
      try {
        // Simuler un délai minimal de 2s pour le splash
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (err) {
        console.error("Erreur chargement dépendances:", err);
      } finally {
        setLoadingDependencies(false);
      }
    };
    loadDependencies();
  }, []);

  // Timer global pour finir le splash minimum 5s
  useEffect(() => {
    if (!loadingDependencies) {
      const timer = setTimeout(() => {
        finishLoading();
      }, 3000); // 2s déjà passées + 3s = 5s total
      return () => clearTimeout(timer);
    }
  }, [loadingDependencies, finishLoading]);

  return (
    <div style={s.container}>
      {/* --- Logo et titre --- */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={s.logoWrapper}
      >
        <div style={s.neonCircle}>C</div>
        <h1 style={s.title}>
          ComicCrafte <span style={s.accent}>Studio</span>
        </h1>
      </motion.div>

      {/* --- Barre de chargement stylée --- */}
      <div style={s.loaderBar}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: loadingDependencies ? "70%" : "100%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
          style={s.progress}
        />
      </div>

      {/* --- Dot loader animé --- */}
      <div style={s.dotsContainer}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            style={s.dot}
          />
        ))}
      </div>

      {/* --- Signature ComicCrafte --- */}
      <div style={s.footerBranding}>
        <span style={s.by}>from</span>
        <div style={s.brandName}>COMICCRAFTE</div>
      </div>

      {/* --- Message dynamique --- */}
      <p style={s.footer}>
        {loadingDependencies
          ? "Chargement des modules..."
          : "Chargement de votre univers..."}
      </p>
    </div>
  );
}

const s = {
  container: {
    height: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #050510 0%, #0a0a0f 50%, #050510 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 10000,
    overflow: "hidden",
    animation: "bgNeon 6s ease-in-out infinite alternate",
  },
  logoWrapper: { textAlign: "center" },
  neonCircle: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "3px solid #ff0055",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#ff0055",
    margin: "0 auto 10px",
    boxShadow: "0 0 15px #ff0055, inset 0 0 6px #ff0055",
    fontFamily: "Orbitron, sans-serif",
  },
  title: { color: "white", fontSize: "16px", letterSpacing: "1.5px", fontFamily: "Orbitron, sans-serif", margin: 0 },
  accent: { color: "#ff0055", textShadow: "0 0 8px #ff0055" },
  loaderBar: { width: "140px", height: "4px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "10px", marginTop: "20px", overflow: "hidden" },
  progress: { height: "100%", background: "linear-gradient(90deg, #ff0055, #00f7ff, #ff00ff)", boxShadow: "0 0 10px #ff0055, 0 0 10px #00f7ff" },
  dotsContainer: { display: "flex", gap: "5px", marginTop: "10px" },
  dot: { width: "4px", height: "4px", backgroundColor: "#ff0055", borderRadius: "50%", boxShadow: "0 0 5px #ff0055" },
  footerBranding: { position: "absolute", bottom: "35px", display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" },
  by: { fontSize: "8px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "1.2px" },
  brandName: { fontSize: "10px", fontWeight: "bold", color: "#fff", letterSpacing: "2px", textShadow: "0 0 4px rgba(255,255,255,0.3)", fontFamily: "'Orbitron', sans-serif" },
  footer: { position: "absolute", bottom: "10px", color: "rgba(255,255,255,0.4)", fontSize: "10px", letterSpacing: "1px" },
  "@keyframes bgNeon": { "0%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" }, "100%": { backgroundPosition: "0% 50%" } },
};