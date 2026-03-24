import React from 'react';
import TrendingGrid from './TrendingGrid';

import { PUBLIC_STORIES } from '../../../data/publicStories';
import { COMICCRAFTE_STORIES } from "../../../data/COMICCRAFTE_DATA";

export default function PublicStoriesSection({
  stories = [],
  setSelectedStory,
  setView,
  neonColor
}) {

  /* ---------------- FUSION DES DB ---------------- */

  const firebaseStories = (stories || []).map(s => ({
    ...s,
    source: "firebase"
  }));

  const publicStories = (PUBLIC_STORIES || []).map(s => ({
    ...s,
    source: "public"
  }));

  const comicStories = (COMICCRAFTE_STORIES || []).map(s => ({
    ...s,
    source: "comicrafte"
  }));

  // 🔥 TOUT fusionné
  const data = [
    ...firebaseStories,
    ...comicStories,
    ...publicStories
  ];

  if (!data || data.length === 0) return null;

  /* ---------------- CLICK ---------------- */

  const handleSelect = (story) => {
    setSelectedStory(story);

    // 👉 Toujours reader si chapters OU pages
    if (story.chapters || story.pages) {
      setView("reader");
    } else {
      setView("story");
    }
  };

  /* ---------------- HERO ---------------- */

  const hero = data[0];

  return (
    <div style={{ marginTop: "25px" }}>
      
      {/* TITRE GLOBAL */}
      <h3 style={{ 
        color: "#fff", 
        fontSize: "14px", 
        marginBottom: "15px",
        textTransform: "uppercase" 
      }}>
        📚 Histoires en vedette
      </h3>

      {/* HERO */}
      {hero && (
        <div style={{ marginBottom: "15px" }}>
          <div
            onClick={() => handleSelect(hero)}
            style={{
              width: "100%",
              height: "180px",
              borderRadius: "12px",
              backgroundImage: `url(${hero.coverImage || "https://via.placeholder.com/300"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              cursor: "pointer",
              overflow: "hidden"
            }}
          >
            <div style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              padding: "10px",
              background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
            }}>
              <h4 style={{ margin: 0, fontSize: "14px" }}>
                {hero.title}
              </h4>

              {/* BADGE SOURCE */}
              <span style={{
                fontSize: "10px",
                color: "#00fff2"
              }}>
                {hero.source}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* GRID */}
      <TrendingGrid
        stories={data.slice(1)}
        setSelectedStory={handleSelect}
        setView={setView}
        neonColor={neonColor}
      />

    </div>
  );
}