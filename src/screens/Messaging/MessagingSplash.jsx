import React, { useEffect } from "react";

/**
 * 🔥 MESSAGING SPLASH V2 — Premium Transition
 * Ce composant gère la transition visuelle vers la messagerie.
 * Il inclut une animation fluide et un message clair pour l'utilisateur.
 */
export default function MessagingSplash({ onComplete }) {
  
  // Règle des 3 secondes (comme mentionné dans tes principes de design)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete(); // Appelle la fonction pour afficher le chat
    }, 2800); // 2.8 secondes pour l'animation

    return () => clearTimeout(timer); // Nettoyage si le composant est démonté
  }, [onComplete]);

  return (
    <>
      {/* 1. STYLES CSS ANIMÉS (Inline pour éviter les fichiers extra) */}
      <style>{`
        @keyframes logoPop {
          0% { transform: scale(0.5); opacity: 0; filter: blur(10px); }
          50% { transform: scale(1.1); opacity: 1; filter: blur(0px); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes textFadeUp {
          0% { transform: translateY(15px); opacity: 0; }
          100% { transform: translateY(0); opacity: 0.8; }
        }

        @keyframes fluidGlow {
          0% { box-shadow: 0 0 20px rgba(0, 255, 127, 0.3); }
          50% { box-shadow: 0 0 40px rgba(0, 255, 127, 0.6); }
          100% { box-shadow: 0 0 20px rgba(0, 255, 127, 0.3); }
        }

        @keyframes lineProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>

      {/* 2. STRUCTURE UI */}
      <div style={s.container}>
        {/* Conteneur centralisé pour le logo et le texte */}
        <div style={s.content}>
          {/* LOGO "C" ANIMÉ */}
          <div style={s.logoCircle}>
            <span style={s.logoChar}>C</span>
          </div>

          {/* NOM DE MARQUE */}
          <h1 style={s.brandName}>
            ComicCrafte <span style={s.brandSub}>Messaging</span>
          </h1>

          {/* MESSAGE DE TRANSITION (Fade in) */}
          <p style={s.transitionMessage}>
            Ouverture de votre espace de discussion...
          </p>
        </div>

        {/* BARRE DE PROGRESSION INFÉRIEURE (Animation fluide) */}
        <div style={s.progressContainer}>
          <div style={s.progressBar}></div>
        </div>
      </div>
    </>
  );
}

/* 3. STYLES JS (Couleurs fluides & Néon) */
const s = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#050505", // Noir profond
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 9999, // S'assure d'être au-dessus de tout
  },
  content: {
    textAlign: "center",
    marginBottom: "50px", // Espace pour la barre de progression
  },
  logoCircle: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    border: "3px solid #00ff7f", // Néon Vert Comic
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 25px auto",
    backgroundColor: "#000",
    animation: "logoPop 1s ease-out forwards, fluidGlow 2s infinite ease-in-out",
  },
  logoChar: {
    fontSize: "50px",
    fontWeight: "bold",
    color: "#00ff7f", // Néon Vert
    textShadow: "0 0 10px rgba(0, 255, 127, 0.7)",
  },
  brandName: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: "1px",
    animation: "textFadeUp 0.8s ease-out 0.5s forwards",
    opacity: 0, // Commence invisible
  },
  brandSub: {
    color: "#ff0055", // Rose Néon (Style Facebook Pro/Comic)
    fontWeight: "normal",
    textShadow: "0 0 10px rgba(255, 0, 85, 0.5)",
  },
  transitionMessage: {
    marginTop: "12px",
    fontSize: "14px",
    color: "#aaa",
    animation: "textFadeUp 0.8s ease-out 1.1s forwards",
    opacity: 0, // Commence invisible
  },
  progressContainer: {
    position: "absolute",
    bottom: "40px",
    width: "250px",
    height: "4px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "2px",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, #00ff7f 0%, #00f5d4 50%, #ff0055 100%)", // Dégradé fluide vert->bleu->rose
    borderRadius: "2px",
    animation: "lineProgress 2.8s linear forwards",
  },
};
