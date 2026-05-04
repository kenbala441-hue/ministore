import React, { useMemo } from "react";

/**
 * FABLES GRID PRO MAX — WEBTOON STYLE
 * - ultra safe
 * - scroll horizontal optimisé mobile
 * - neon UI clean
 * - fallback multi-source
 */

export function FablesGrid({
  fables = [],
  fallbackData = [],
  setSelectedStory,
  setView,
  neonColor = "#ffd300",
  limit = 15
}) {

  // =========================
  // SAFE DATA ENGINE
  // =========================
  const data = useMemo(() => {
    const src =
      Array.isArray(fables) && fables.length > 0
        ? fables
        : fallbackData;

    if (!Array.isArray(src)) return [];

    return src
      .filter(Boolean)
      .slice(0, limit)
      .map((item, i) => ({
        id: item?.id || `fable-${i}`,
        title: item?.title || "Fable inconnue",
        cover:
          item?.coverImage ||
          item?.cover ||
          item?.pages?.[0]?.src ||
          "https://via.placeholder.com/300x450/111/222?text=Fable",
        raw: item
      }));
  }, [fables, fallbackData, limit]);

  // =========================
  // NAVIGATION SAFE
  // =========================
  const handleOpen = (item) => {
    if (!item?.raw) return;
    setSelectedStory?.(item.raw);
    setView?.("reader");

    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  if (!data.length) return null;

  return (
    <div style={styles.container}>

      {/* HEADER NEON STYLE */}
      <div style={styles.header}>
        <div style={styles.bar} />
        <h3 style={styles.title}>
          📖 Fables & Sagesse
        </h3>
      </div>

      {/* SCROLL HORIZONTAL */}
      <div style={styles.scroll}>

        {data.map((item) => (
          <div
            key={item.id}
            style={styles.card}
            onClick={() => handleOpen(item)}
          >

            {/* IMAGE */}
            <div style={styles.imageBox}>
              <img
                src={item.cover}
                alt={item.title}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/300x450/111/222?text=Fable";
                }}
                style={styles.image}
              />

              {/* BADGE NEON */}
              <div style={{
                ...styles.badge,
                borderColor: neonColor,
                color: neonColor
              }}>
                ZEN
              </div>
            </div>

            {/* TITLE */}
            <div style={styles.text}>
              {item.title}
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

/* ================= STYLES PRO ================= */

const styles = {
  container: {
    margin: "18px 0",
    width: "100%"
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 15px",
    marginBottom: 10
  },

  bar: {
    width: 3,
    height: 16,
    background: "#ffd300",
    borderRadius: 3
  },

  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },

  scroll: {
    display: "flex",
    overflowX: "auto",
    gap: 10,
    padding: "0 15px 8px 15px",
    scrollbarWidth: "none",
    WebkitOverflowScrolling: "touch"
  },

  card: {
    flex: "0 0 110px",
    cursor: "pointer"
  },

  imageBox: {
    width: 110,
    height: 150,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    background: "#111",
    border: "1px solid rgba(255,255,255,0.05)"
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },

  badge: {
    position: "absolute",
    bottom: 6,
    right: 6,
    fontSize: 8,
    fontWeight: "900",
    padding: "2px 6px",
    borderRadius: 4,
    background: "rgba(0,0,0,0.7)",
    border: "1px solid"
  },

  text: {
    marginTop: 6,
    fontSize: 11,
    color: "#ddd",
    fontWeight: "600",
    display: "-webkit-box",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
    overflow: "hidden"
  }
};