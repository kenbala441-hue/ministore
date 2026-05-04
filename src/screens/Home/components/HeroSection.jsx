import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AUTO_DELAY = 5000;

export default function HeroSection({
  stories = [],
  ads = [], // 🔥 NOUVEAU (images externes)
  mode = "stories", // "stories" | "ads" | "mixed"
  setSelectedStory,
  setView
}) {
  const [index, setIndex] = useState(0);
  const pauseRef = useRef(false);

  // 🔒 SAFE STORIES
  const safeStories = useMemo(() => {
    return Array.isArray(stories)
      ? stories.filter((s) => s && typeof s === "object")
      : [];
  }, [stories]);

  // 🔒 SAFE ADS
  const safeAds = useMemo(() => {
    return Array.isArray(ads)
      ? ads.filter((a) => a && a.url)
      : [];
  }, [ads]);

  // 🔥 DATA SOURCE
  const data = useMemo(() => {
    if (mode === "ads") return safeAds;
    if (mode === "mixed") return [...safeAds, ...safeStories];
    return safeStories;
  }, [mode, safeStories, safeAds]);

  const hasData = data.length > 0;
  const current = hasData ? data[index] : null;

  // 🔁 AUTO SLIDE
  useEffect(() => {
    if (!hasData || data.length <= 1) return;

    const timer = setInterval(() => {
      if (!pauseRef.current) {
        setIndex((prev) => (prev + 1) % data.length);
      }
    }, AUTO_DELAY);

    return () => clearInterval(timer);
  }, [data.length, hasData]);

  // 📖 NAVIGATION STORY
  const handleOpen = useCallback(() => {
    try {
      if (!current || current.url) return; // ❌ si c’est une pub → pas de lecture

      const normalized = {
        ...current,
        cover: current.coverImage || current.cover || "",
        coverImage: current.coverImage || current.cover || "",
        pages: Array.isArray(current.pages)
          ? current.pages
          : (Array.isArray(current.chapters) && current.chapters[0]?.pages) || []
      };

      if (typeof setSelectedStory === "function") {
        setSelectedStory(normalized);
      }

      if (typeof setView === "function") {
        const hasContent =
          normalized.pages?.length > 0 ||
          (Array.isArray(current.chapters) && current.chapters.length > 0) ||
          current.folder;

        setView(hasContent ? "reader" : "story");
      }

      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error("Hero navigation error:", err);
    }
  }, [current, setSelectedStory, setView]);

  if (!hasData) return null;

  const isAd = !!current?.url;

  return (
    <div style={{ padding: "0 10px" }}>
      <section
        onMouseEnter={() => (pauseRef.current = true)}
        onMouseLeave={() => (pauseRef.current = false)}
        onTouchStart={() => (pauseRef.current = true)}
        onTouchEnd={() => (pauseRef.current = false)}
        style={{
          position: "relative",
          height: "320px", // 🔥 plus compact
          borderRadius: "16px",
          overflow: "hidden",
          backgroundColor: "#111",
          boxShadow: "0 10px 30px rgba(0,0,0,0.6)"
        }}
      >
        {/* IMAGE */}
        <AnimatePresence mode="popLayout">
          <motion.img
            key={current?.id || current?.url || index}
            src={
              current?.coverImage ||
              current?.cover ||
              current?.url ||
              ""
            }
            alt={current?.title || "hero"}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        </AnimatePresence>

        {/* GRADIENT */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 40%, transparent 100%)"
          }}
        />

        {/* CONTENT */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            zIndex: 2
          }}
        >
          {/* TAG */}
          <span
            style={{
              fontSize: "10px",
              fontWeight: "800",
              color: isAd ? "#FFD700" : "#39ff14",
              textTransform: "uppercase",
              marginBottom: "6px"
            }}
          >
            {isAd ? "Annonce" : current?.genres?.[0] || "Story"}
          </span>

          {/* TITLE */}
          <h2
            style={{
              margin: "0 0 10px 0",
              fontSize: "18px",
              fontWeight: "800",
              color: "#fff",
              textTransform: "uppercase",
              lineHeight: 1.2,
              maxWidth: "90%",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}
          >
            {current?.title || "Untitled"}
          </h2>

          {/* ACTIONS */}
          {!isAd && (
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handleOpen}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: "none",
                  background: "#fff",
                  color: "#000",
                  fontWeight: "700",
                  fontSize: "12px",
                  cursor: "pointer",
                  minWidth: "90px"
                }}
              >
                Lire
              </button>

              <button
                style={{
                  padding: "8px 14px",
                  borderRadius: "20px",
                  border: "1px solid rgba(255,255,255,0.4)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "12px"
                }}
              >
                + Suivre
              </button>
            </div>
          )}

          {/* DOTS */}
          {data.length > 1 && (
            <div style={{ display: "flex", gap: "6px", marginTop: "14px" }}>
              {data.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === index ? "16px" : "6px",
                    height: "6px",
                    borderRadius: "3px",
                    backgroundColor:
                      i === index ? "#fff" : "rgba(255,255,255,0.3)"
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