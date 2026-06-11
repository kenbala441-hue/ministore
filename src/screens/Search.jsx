import React, { useState, useMemo } from "react";
import { COMICCRAFTE_STORIES } from "../data/Action";
import { FABLES_DATABASE } from "../data/fablesDatabase";
import { MANGA_DATABASE } from "../data/MangaDesign";
import { SIMPLE_FABLES } from "../data/Fables";
import { PUBLIC_STORIES } from "../data/publicStories"; 
export default function SearchBar({ setSelectedStory, setView }) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // 🌈 NEON COLORS (branding ComicCrafte)
  const neon = "#00f7ff";

  // 🔍 NORMALISATION (anti accents)
  const normalize = (str) =>
    str
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") || "";

  // 🔥 SEARCH ENGINE OPTIMISÉ
  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return [];

    const all = [
      ...COMICCRAFTE_STORIES,
      ...FABLES_DATABASE,
      ...SIMPLE_FABLES,
      ... MANGA_DATABASE,
      ...PUBLIC_STORIES
    ];

    return all
      .filter((s) => {
        const title = normalize(s?.title);
        const author = normalize(s?.author);
        const genres = normalize(s?.genres?.join(" "));

        return (
          title.includes(q) ||
          author.includes(q) ||
          genres.includes(q)
        );
      })
      .slice(0, 8);
  }, [query]);

  const openStory = (story) => {
    if (!story) return;
    setSelectedStory?.(story);
    setView?.("reader");
    setQuery("");
    setIsFocused(false);
  };

  return (
    <div style={styles.wrapper}>

      {/* INPUT NEON */}
      <div style={{
        ...styles.inputBox,
        borderColor: isFocused ? neon : "#222",
        boxShadow: isFocused ? `0 0 12px ${neon}55` : "none"
      }}>
        <span style={styles.icon}>🔍</span>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder="Rechercher une histoire, auteur..."
          style={styles.input}
        />

        {query && (
          <span
            onClick={() => setQuery("")}
            style={styles.clear}
          >
            ✕
          </span>
        )}
      </div>

      {/* RESULTATS DROP */}
      {isFocused && query.trim() && (
        <div style={styles.dropdown}>

          {results.length === 0 ? (
            <div style={styles.empty}>
              Aucun résultat pour <b>"{query}"</b>
            </div>
          ) : (
            results.map((story, i) => (
              <div
                key={story.id + i}
                onMouseDown={() => openStory(story)}
                style={styles.result}
              >

                {/* COVER */}
                <img
                  src={story.coverImage || "https://via.placeholder.com/100"}
                  alt={story.title}
                  style={styles.cover}
                />

                {/* TEXT */}
                <div style={styles.text}>
                  <div style={styles.title}>
                    {story.title}
                  </div>

                  <div style={styles.meta}>
                    {story.author || "Auteur inconnu"}
                  </div>

                  <div style={styles.tags}>
                    {story.genres?.slice(0, 2).join(" • ")}
                  </div>
                </div>

              </div>
            ))
          )}

        </div>
      )}
    </div>
  );
}

/* ================= STYLES PRO ================= */

const styles = {
  wrapper: {
    position: "relative",
    width: "100%"
  },

  inputBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#0d0d0d",
    border: "1px solid #222",
    borderRadius: "14px",
    padding: "10px 12px",
    transition: "0.3s"
  },

  icon: {
    fontSize: "14px",
    opacity: 0.8
  },

  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    fontSize: "14px"
  },

  clear: {
    fontSize: "14px",
    cursor: "pointer",
    color: "#888"
  },

  dropdown: {
    position: "absolute",
    top: "110%",
    left: 0,
    right: 0,
    background: "#0b0b0b",
    border: "1px solid #222",
    borderRadius: "14px",
    marginTop: "8px",
    maxHeight: "320px",
    overflowY: "auto",
    zIndex: 1000,
    boxShadow: "0 10px 30px rgba(0,0,0,0.6)"
  },

  result: {
    display: "flex",
    gap: "10px",
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #1a1a1a",
    transition: "0.2s"
  },

  cover: {
    width: "45px",
    height: "60px",
    borderRadius: "6px",
    objectFit: "cover",
    background: "#222"
  },

  text: {
    flex: 1
  },

  title: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#fff"
  },

  meta: {
    fontSize: "11px",
    color: "#aaa",
    marginTop: "2px"
  },

  tags: {
    fontSize: "10px",
    color: "#00f7ff",
    marginTop: "4px"
  },

  empty: {
    padding: "14px",
    color: "#777",
    fontSize: "13px",
    textAlign: "center"
  }
};