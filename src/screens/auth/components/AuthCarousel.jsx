// ==========================================
// src/screens/auth/components/AuthCarousel.jsx
// ==========================================

import React, {
  useEffect,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  ChevronRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const slides = [
  {
    id: 1,

    image:
      "https://res.cloudinary.com/dn9c4ctav/image/upload/v1772150811/1762552814369_tdmwse.png",

    badge:
      "dark fantasy",

    title:
      "les héritiers de l'oubli",

    subtitle:
      "une aventure immersive et cinématographique",
  },

  {
    id: 2,

    image:
      "https://res.cloudinary.com/dn9c4ctav/image/upload/v1774630505/1774630494659_gzve7l.png",

    badge:
      "trending",

    title:
      "blackline",

    subtitle:
      "le nouveau chapitre arrive cette semaine",
  },

  {
    id: 3,

    image:
      "https://picsum.photos/1200/1800?random=12",

    badge:
      "comiccraft",

    title:
      "expérience premium",

    subtitle:
      "optimisé android, web et capacitor",
  },
];

export default function AuthCarousel({
  onContinue,
}) {

  const [current, setCurrent] =
    useState(0);

  const [isMobile, setIsMobile] =
    useState(
      window.innerWidth < 768
    );

  // ==========================================
  // MOBILE
  // ==========================================

  useEffect(() => {

    const resize = () =>
      setIsMobile(
        window.innerWidth < 768
      );

    window.addEventListener(
      "resize",
      resize
    );

    return () =>
      window.removeEventListener(
        "resize",
        resize
      );

  }, []);

  // ==========================================
  // AUTO SLIDE
  // ==========================================

  useEffect(() => {

    const interval =
      setInterval(() => {

        setCurrent((prev) =>
          prev ===
          slides.length - 1
            ? 0
            : prev + 1
        );

      }, 5000);

    return () =>
      clearInterval(interval);

  }, []);

  return (

    <div style={styles.wrapper}>

      {/* IMAGE */}

      <AnimatePresence
        mode="wait"
      >

        <motion.img
          key={slides[current].id}
          src={
            slides[current].image
          }
          alt={
            slides[current].title
          }
          style={styles.image}
          initial={{
            opacity: 0,
            scale: 1.06,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.7,
          }}
        />

      </AnimatePresence>

      {/* OVERLAY */}

      <div style={styles.overlay} />

      {/* GLOW */}

      <div style={styles.glow1} />
      <div style={styles.glow2} />

      {/* CONTENT */}

      <div style={styles.content}>

        {/* LOGO */}

        <motion.div
          initial={{
            opacity: 0,
            y: -12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          style={{
            ...styles.logo,
            fontSize:
              isMobile
                ? 11
                : 13,
          }}
        >

          <Sparkles
            size={
              isMobile
                ? 12
                : 14
            }
          />

          <span>
            comiccraft
          </span>

        </motion.div>

        {/* BADGE */}

        <motion.div
          key={
            slides[current]
              .badge
          }
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          style={{
            ...styles.badge,
            fontSize:
              isMobile
                ? 10
                : 11,
          }}
        >

          {
            slides[current]
              .badge
          }

        </motion.div>

        {/* TITLE */}

        <AnimatePresence
          mode="wait"
        >

          <motion.h1
            key={
              slides[current]
                .title
            }
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.4,
            }}
            style={{
              ...styles.title,

              fontSize:
                isMobile
                  ? "34px"
                  : "64px",
            }}
          >

            {
              slides[current]
                .title
            }

          </motion.h1>

        </AnimatePresence>

        {/* SUBTITLE */}

        <AnimatePresence
          mode="wait"
        >

          <motion.p
            key={
              slides[current]
                .subtitle
            }
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
            }}
            style={{
              ...styles.subtitle,

              fontSize:
                isMobile
                  ? "11px"
                  : "14px",
            }}
          >

            {
              slides[current]
                .subtitle
            }

          </motion.p>

        </AnimatePresence>

        {/* SECURITY */}

        <div
          style={{
            ...styles.security,
            fontSize:
              isMobile
                ? 10
                : 12,
          }}
        >

          <ShieldCheck
            size={
              isMobile
                ? 12
                : 14
            }
          />

          <span>
            environnement
            sécurisé
          </span>

        </div>

        {/* BUTTON */}

        <motion.button
          whileTap={{
            scale: 0.97,
          }}
          onClick={onContinue}
          style={{
            ...styles.button,

            height:
              isMobile
                ? 50
                : 58,

            fontSize:
              isMobile
                ? 13
                : 15,
          }}
        >

          <span>
            continuer
          </span>

          <ChevronRight
            size={
              isMobile
                ? 16
                : 18
            }
          />

        </motion.button>

        {/* DOTS */}

        <div style={styles.dots}>

          {slides.map(
            (
              item,
              index
            ) => (

              <div
                key={item.id}
                style={{
                  ...styles.dot,

                  width:
                    current ===
                    index
                      ? 18
                      : 5,

                  opacity:
                    current ===
                    index
                      ? 1
                      : 0.35,
                }}
              />

            )
          )}

        </div>

      </div>

    </div>

  );

}

// ==========================================
// STYLES
// ==========================================

const styles = {

  wrapper: {
    width: "100%",
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background: "#050816",
  },

  image: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter:
      "brightness(0.45)",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      `
      linear-gradient(
        to top,
        rgba(0,0,0,0.92),
        rgba(0,0,0,0.35)
      )
    `,
    zIndex: 1,
  },

  glow1: {
    position: "absolute",
    top: -120,
    left: -120,
    width: 300,
    height: 300,
    borderRadius: "50%",
    background:
      "rgba(0,229,255,0.16)",
    filter: "blur(120px)",
    zIndex: 1,
  },

  glow2: {
    position: "absolute",
    bottom: -120,
    right: -120,
    width: 300,
    height: 300,
    borderRadius: "50%",
    background:
      "rgba(123,97,255,0.18)",
    filter: "blur(120px)",
    zIndex: 1,
  },

  content: {
    position: "relative",
    zIndex: 3,
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding:
      "26px 20px 34px",
    boxSizing: "border-box",
  },

  logo: {
    position: "absolute",
    top: 20,
    left: 20,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    borderRadius: 999,
    background:
      "rgba(255,255,255,0.08)",
    border:
      "1px solid rgba(255,255,255,0.06)",
    color: "#fff",
    fontWeight: "800",
    textTransform:
      "lowercase",
    backdropFilter:
      "blur(16px)",
  },

  badge: {
    alignSelf: "flex-start",
    padding: "7px 12px",
    borderRadius: 999,
    background:
      "rgba(255,255,255,0.08)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    color: "#fff",
    fontWeight: "800",
    marginBottom: 16,
    textTransform:
      "lowercase",
    backdropFilter:
      "blur(14px)",
  },

  title: {
    color: "#fff",
    fontWeight: "900",
    lineHeight: 0.9,
    letterSpacing: "-3px",
    maxWidth: 500,
    margin: 0,
    textTransform:
      "lowercase",
    textShadow:
      "0 10px 40px rgba(0,0,0,0.6)",
  },

  subtitle: {
    color:
      "rgba(255,255,255,0.72)",
    lineHeight: 1.7,
    marginTop: 18,
    maxWidth: 320,
    textTransform:
      "lowercase",
  },

  security: {
    marginTop: 20,
    width: "fit-content",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    borderRadius: 999,
    background:
      "rgba(255,255,255,0.08)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    color: "#d8f7ff",
    fontWeight: "700",
    textTransform:
      "lowercase",
    backdropFilter:
      "blur(12px)",
  },

  button: {
    marginTop: 26,
    width: "100%",
    border: "none",
    borderRadius: 18,
    background:
      "linear-gradient(135deg,#00d9ff,#6f6bff)",
    color: "#fff",
    fontWeight: "800",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    boxShadow:
      "0 0 40px rgba(0,217,255,0.35)",
    textTransform:
      "lowercase",
  },

  dots: {
    marginTop: 18,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },

  dot: {
    height: 5,
    borderRadius: 999,
    background: "#fff",
    transition: "0.3s",
  },

};