import React, { useState, useEffect } from "react";
import MySeries from "./MySeries";

export default function MySeriesIndex({ setView, setSelectedStory }) {
  const [savedData, setSavedData] = useState({
    recent: [],
    favorites: [],
    downloads: []
  });

  // État pour l'illusion de téléchargement
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const loadData = () => {
      const recent = JSON.parse(localStorage.getItem("comicrafte_recent")) || [];
      const favorites = JSON.parse(localStorage.getItem("comicrafte_favorites")) || [];
      const downloads = JSON.parse(localStorage.getItem("comicrafte_downloads")) || [];

      // --- LOGIQUE D'ILLUSION ---
      // On cherche l'histoire la plus récemment ajoutée
      const newestDownload = downloads.reduce((prev, curr) => 
        (prev.downloadedAt > curr.downloadedAt) ? prev : curr, {});

      const now = new Date().getTime();
      // Si elle a été ajoutée il y a moins de 4 secondes, on lance l'animation
      if (newestDownload.id && (now - newestDownload.downloadedAt) < 4000) {
        setDownloadingId(newestDownload.id);
        
        // On cache l'animation après 3 secondes pour laisser place au badge "Offline"
        setTimeout(() => {
          setDownloadingId(null);
        }, 3000);
      }

      setSavedData({ recent, favorites, downloads });
    };

    loadData();

    // Écoute les changements (Provient du Reader via dispatchEvent)
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, []);

  const removeItem = (id, category) => {
    const key = `comicrafte_${category.toLowerCase()}`;
    const currentList = JSON.parse(localStorage.getItem(key)) || [];
    const updatedList = currentList.filter(item => item.id !== id);

    localStorage.setItem(key, JSON.stringify(updatedList));
    setSavedData(prev => ({
      ...prev,
      [category.toLowerCase()]: updatedList
    }));
  };

  return (
    <MySeries
      setView={setView}
      setSelectedStory={(story) => {
        // On s'assure que si l'histoire vient des téléchargements, 
        // elle garde son marqueur isOffline pour le Reader
        setSelectedStory(story);
      }}
      savedData={savedData}
      removeItem={removeItem}
      downloadingId={downloadingId} 
    />
  );
}
