// src/screens/series/MySeriesIndex.jsx
// VERSION 2026 — Stable / Offline / Compact / Premium
// Synchronisation intelligente localStorage
// Optimisé Android + React mobile web app

import React, { useState, useEffect, useCallback, useMemo } from "react";
import MySeries from "./MySeries";

const STORAGE_KEYS = {
  recent: "comicrafte_recent",
  favorites: "comicrafte_favorites",
  downloads: "comicrafte_downloads",
  unlocked: "comicrafte_unlocked",
};

export default function MySeriesIndex({
  setView,
  setSelectedStory,
}) {
  const [savedData, setSavedData] = useState({
    recent: [],
    favorites: [],
    downloads: [],
    unlocked: [],
  });

  const [downloadingId, setDownloadingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 SAFE JSON
  const safeParse = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  };

  // 🔥 LOAD ALL DATA
  const loadLibrary = useCallback(() => {
    try {
      const recent = safeParse(STORAGE_KEYS.recent);
      const favorites = safeParse(STORAGE_KEYS.favorites);
      const downloads = safeParse(STORAGE_KEYS.downloads);
      const unlocked = safeParse(STORAGE_KEYS.unlocked);

      // 🔹 Tri intelligent
      const sortByDate = (arr) =>
        [...arr].sort(
          (a, b) =>
            (b.savedAt || b.downloadedAt || 0) -
            (a.savedAt || a.downloadedAt || 0)
        );

      const formatted = {
        recent: sortByDate(recent),
        favorites: sortByDate(favorites),
        downloads: sortByDate(downloads),
        unlocked: sortByDate(unlocked),
      };

      setSavedData(formatted);

      // 🔥 Animation téléchargement récent
      const newestDownload = downloads?.[0];

      if (
        newestDownload?.id &&
        newestDownload?.downloadedAt
      ) {
        const now = Date.now();

        if (now - newestDownload.downloadedAt < 4500) {
          setDownloadingId(newestDownload.id);

          setTimeout(() => {
            setDownloadingId(null);
          }, 3200);
        }
      }

      setLoading(false);
    } catch (err) {
      console.error("Library Load Error:", err);
      setLoading(false);
    }
  }, []);

  // 🔥 INIT
  useEffect(() => {
    loadLibrary();

    // Sync multi-composants
    const sync = () => loadLibrary();

    window.addEventListener("storage", sync);
    window.addEventListener("comicrafte-library-update", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(
        "comicrafte-library-update",
        sync
      );
    };
  }, [loadLibrary]);

  // 🔥 REMOVE ITEM
  const removeItem = useCallback((id, category) => {
    try {
      const key =
        STORAGE_KEYS[category.toLowerCase()];

      if (!key) return;

      const current =
        JSON.parse(localStorage.getItem(key)) || [];

      const updated = current.filter(
        (item) => item.id !== id
      );

      localStorage.setItem(
        key,
        JSON.stringify(updated)
      );

      // Sync direct
      setSavedData((prev) => ({
        ...prev,
        [category.toLowerCase()]: updated,
      }));

      // Broadcast update
      window.dispatchEvent(
        new Event("comicrafte-library-update")
      );
    } catch (err) {
      console.error("Remove Error:", err);
    }
  }, []);

  // 🔥 OPEN READER
  const handleSelectStory = useCallback(
    (story) => {
      if (!story) return;

      // Sauvegarde lecture récente intelligente
      try {
        const recent =
          JSON.parse(
            localStorage.getItem(
              STORAGE_KEYS.recent
            )
          ) || [];

        const filtered = recent.filter(
          (s) => s.id !== story.id
        );

        const updated = [
          {
            ...story,
            savedAt: Date.now(),
            lastReadAt: Date.now(),
          },
          ...filtered,
        ].slice(0, 60);

        localStorage.setItem(
          STORAGE_KEYS.recent,
          JSON.stringify(updated)
        );

        window.dispatchEvent(
          new Event("comicrafte-library-update")
        );
      } catch {}

      setSelectedStory(story);
      setView("reader");
    },
    [setSelectedStory, setView]
  );

  // 🔥 STATS
  const stats = useMemo(() => {
    return {
      total:
        savedData.recent.length +
        savedData.favorites.length +
        savedData.downloads.length,

      favorites:
        savedData.favorites.length,

      downloads:
        savedData.downloads.length,
    };
  }, [savedData]);

  if (loading) {
    return (
      <div style={loaderStyle.wrapper}>
        <div style={loaderStyle.loader}></div>

        <div style={loaderStyle.text}>
          Chargement bibliothèque...
        </div>
      </div>
    );
  }

  return (
    <MySeries
      setView={setView}
      setSelectedStory={handleSelectStory}
      savedData={savedData}
      removeItem={removeItem}
      downloadingId={downloadingId}
      stats={stats}
    />
  );
}

const loaderStyle = {
  wrapper: {
    height: "100vh",
    background: "#05070d",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    color: "#fff",
  },

  loader: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "3px solid rgba(255,255,255,0.08)",
    borderTop: "3px solid #00e0ff",
    animation: "spin 0.8s linear infinite",
  },

  text: {
    fontSize: "13px",
    opacity: 0.7,
    fontWeight: "600",
  },
};