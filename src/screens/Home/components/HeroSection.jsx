import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Plus,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const AUTO_DELAY = 4500;

export default function HeroSection({
  stories = [],
  ads = [],
  mode = "stories",
  setSelectedStory,
  setView
}) {
  const [index, setIndex] = useState(0);
  const pauseRef = useRef(false);

  /* =========================
      SAFE DATA
  ========================= */

  const safeStories = useMemo(() => {
    return Array.isArray(stories)
      ? stories.filter(Boolean)
      : [];
  }, [stories]);

  const safeAds = useMemo(() => {
    return Array.isArray(ads)
      ? ads.filter((a) => a?.url)
      : [];
  }, [ads]);

  const data = useMemo(() => {
    if (mode === "ads") return safeAds;

    if (mode === "mixed") {
      return [...safeStories, ...safeAds];
    }

    return safeStories;
  }, [mode, safeStories, safeAds]);

  const current = data[index];

  /* =========================
      AUTO SLIDE
  ========================= */

  useEffect(() => {
    if (data.length <= 1) return;

    const interval = setInterval(() => {
      if (!pauseRef.current) {
        setIndex((prev) => (prev + 1) % data.length);
      }
    }, AUTO_DELAY);

    return () => clearInterval(interval);
  }, [data.length]);

  /* =========================
      NAVIGATION
  ========================= */

  const handleOpen = useCallback(() => {
    if (!current || current.url) return;

    const normalized = {
      ...current,
      coverImage:
        current.coverImage ||
        current.cover ||
        "",
      pages:
        current.pages ||
        current.chapters?.[0]?.pages ||
        []
    };

    setSelectedStory?.(normalized);

    const hasReader =
      normalized.pages?.length > 0 ||
      normalized.chapters?.length > 0;

    setView?.(hasReader ? "reader" : "reader");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [current, setSelectedStory, setView]);

  /* =========================
      CONTROLS
  ========================= */

  const next = () => {
    setIndex((p) => (p + 1) % data.length);
  };

  const prev = () => {
    setIndex((p) =>
      p === 0 ? data.length - 1 : p - 1
    );
  };

  if (!data.length) return null;

  const isAd = !!current?.url;

  return (
    <div style={s.wrapper}>
      <section
        style={s.hero}
        onMouseEnter={() => (pauseRef.current = true)}
        onMouseLeave={() => (pauseRef.current = false)}
        onTouchStart={() => (pauseRef.current = true)}
        onTouchEnd={() => (pauseRef.current = false)}
      >

        {/* BACKGROUND */}
        <AnimatePresence mode="wait">
          <motion.img
            key={current?.id || current?.url || index}
            src={
              current?.coverImage ||
              current?.cover ||
              current?.url
            }
            alt={current?.title || "hero"}
            initial={{
              opacity: 0,
              scale: 1.06
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0
            }}
            transition={{
              duration: 0.55
            }}
            style={s.image}
          />
        </AnimatePresence>

        {/* OVERLAY */}
        <div style={s.overlay} />

        {/* TOP FLOAT */}
        <div style={s.topBar}>
          <div style={s.liveBadge}>
            <span style={s.liveDot} />
            {isAd ? "Annonce" : "Trending"}
          </div>

          <div style={s.counter}>
            {index + 1}/{data.length}
          </div>
        </div>

        {/* NAV */}
        {data.length > 1 && (
          <>
            <button style={s.navLeft} onClick={prev}>
              <ChevronLeft size={16} />
            </button>

            <button style={s.navRight} onClick={next}>
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* CONTENT */}
        <div style={s.content}>

          {/* GENRE */}
          <span style={s.genre}>
            {isAd
              ? "SPONSOR"
              : current?.genres?.[0] || "Story"}
          </span>

          {/* TITLE */}
          <h1 style={s.title}>
            {current?.title || "Untitled"}
          </h1>

          {/* DESCRIPTION */}
          {!isAd && (
            <p style={s.desc}>
              {current?.description ||
                "Découvrez cette histoire exclusive maintenant."}
            </p>
          )}

          {/* ACTIONS */}
          {!isAd && (
            <div style={s.actions}>

              <button
                style={s.readBtn}
                onClick={handleOpen}
              >
                <Play size={13} fill="#000" />
                Lire
              </button>

              <button style={s.followBtn}>
                <Plus size={13} />
              </button>

            </div>
          )}

          {/* FLOATING PROGRESS */}
          {data.length > 1 && (
            <div style={s.progressWrapper}>
              {data.map((_, i) => (
                <div
                  key={i}
                  style={{
                    ...s.progress,
                    width:
                      i === index ? 24 : 5,
                    opacity:
                      i === index ? 1 : 0.35
                  }}
                />
              ))}
            </div>
          )}

        </div>

      </section>
    </div>
  );
}

const glass = "rgba(255,255,255,0.08)";

const s = {
  wrapper: {
    padding: "0 10px",
    marginBottom: "18px"
  },

  hero: {
    position: "relative",
    height: "255px",
    borderRadius: "22px",
    overflow: "hidden",
    background: "#080808",
    boxShadow: "0 10px 35px rgba(0,0,0,0.45)"
  },

  image: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: `
      linear-gradient(
        to top,
        rgba(0,0,0,0.95) 5%,
        rgba(0,0,0,0.45) 45%,
        rgba(0,0,0,0.15) 100%
      )
    `
  },

  topBar: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    zIndex: 5,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  liveBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 10px",
    borderRadius: "30px",
    background: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(10px)",
    color: "#fff",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "0.4px"
  },

  liveDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#00ff99",
    boxShadow: "0 0 10px #00ff99"
  },

  counter: {
    padding: "5px 10px",
    borderRadius: "30px",
    background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(10px)",
    color: "#fff",
    fontSize: "10px",
    fontWeight: "700"
  },

  navLeft: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "none",
    background: glass,
    backdropFilter: "blur(10px)",
    color: "#fff"
  },

  navRight: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "none",
    background: glass,
    backdropFilter: "blur(10px)",
    color: "#fff"
  },

  content: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: "18px",
    zIndex: 5
  },

  genre: {
    display: "inline-flex",
    padding: "5px 10px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(8px)",
    color: "#00f7ff",
    fontSize: "9px",
    fontWeight: "900",
    marginBottom: "10px",
    letterSpacing: "0.5px"
  },

  title: {
    color: "#fff",
    fontSize: "21px",
    fontWeight: "900",
    lineHeight: 1.1,
    margin: 0,
    maxWidth: "75%",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden"
  },

  desc: {
    color: "#cfcfcf",
    fontSize: "11px",
    lineHeight: 1.4,
    marginTop: "8px",
    marginBottom: "14px",
    maxWidth: "85%",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden"
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  readBtn: {
    height: "38px",
    padding: "0 18px",
    borderRadius: "30px",
    border: "none",
    background: "#fff",
    color: "#000",
    fontWeight: "800",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },

  followBtn: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.15)",
    background: glass,
    backdropFilter: "blur(10px)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  progressWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginTop: "16px"
  },

  progress: {
    height: "5px",
    borderRadius: "10px",
    background: "#fff",
    transition: "0.3s"
  }
};