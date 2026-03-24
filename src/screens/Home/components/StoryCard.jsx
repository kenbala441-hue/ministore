import React, { useMemo, useCallback } from "react";
import {
  likeStory,
  commentStory,
  shareStory,
} from "../../../utils/firebaseActions";

export default function StoryCard({
  story,
  setSelectedStory,
  setView,
  user,
}) {
  // 🔥 TON IMAGE OFFICIELLE CLOUDINARY (Placeholder)
  const PLACEHOLDER =
    "https://res.cloudinary.com/dn9c4ctav/image/upload/v1772147595/1751816044094_fvqghc.png";

  // 🔹 Déstructuration sécurisée
  const {
    id,
    title = "Sans titre",
    description = "",
    likesCount = 0,
    commentsCount = 0,
    sharesCount = 0,
    viewsCount = 0,
  } = story || {};

  // 🔹 LOGIQUE D'IMAGE ALIGNÉE SUR HEROSECTION (LA PLUS COMPATIBLE)
  const coverSrc = useMemo(() => {
    if (!story) return PLACEHOLDER;

    // DEBUG: Affiche les données reçues pour chaque carte dans la console
    console.log(`Données image pour [${title}]:`, {
        coverImage: story.coverImage,
        cover: story.cover,
        firstPage: story.pages?.[0]
    });

    const img = 
      story.coverImage ||
      story.cover ||
      story.pages?.find(p => p.type === 'image')?.src ||
      story.pages?.[0]?.src || 
      PLACEHOLDER;

    return img;
  }, [story, PLACEHOLDER]);

  // 🔹 Navigation
  const handleOpen = useCallback(() => {
    if (!story) return;
    setSelectedStory(story);
    setView("reader");
  }, [story, setSelectedStory, setView]);

  // 🔹 Actions (Like, Comment, Share)
  const handleLike = (e) => {
    e.stopPropagation();
    if (!user?.uid || !id) return;
    likeStory(user.uid, id);
  };

  const handleComment = (e) => {
    e.stopPropagation();
    if (!user?.uid || !id) return;
    const text = prompt("Ton commentaire :");
    if (!text) return;
    commentStory(user.uid, id, text);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (!user?.uid || !id) return;
    shareStory(user.uid, id);
  };

  return (
    <div
      onClick={handleOpen}
      style={{
        cursor: "pointer",
        border: "1px solid #00fff233", // Bordure plus subtile style Apple
        borderRadius: "16px",
        background: "#111",
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 0 15px #00fff255";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Container Image */}
      <div style={{ position: 'relative', height: '180px', background: '#222' }}>
        <img
          src={coverSrc}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER;
          }}
        />
      </div>

      {/* Infos Content */}
      <div style={{ padding: "12px" }}>
        <h4 style={{ color: "#00fff2", margin: "0 0 6px 0", fontSize: "15px", fontWeight: '600' }}>
          {title}
        </h4>

        {description && (
          <p style={{ fontSize: "11px", color: "#888", marginBottom: "10px", height: '32px', overflow: 'hidden' }}>
            {description.length > 60 ? description.slice(0, 60) + "..." : description}
          </p>
        )}

        {/* Barre de Stats style Webtoon */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#aaa", borderTop: '1px solid #222', paddingTop: '8px' }}>
          <span>👁 {viewsCount}</span>
          <span onClick={handleLike} style={{ cursor: "pointer" }}>❤️ {likesCount}</span>
          <span onClick={handleComment} style={{ cursor: "pointer" }}>💬 {commentsCount}</span>
          <span onClick={handleShare} style={{ cursor: "pointer" }}>🔗</span>
        </div>
      </div>
    </div>
  );
}
