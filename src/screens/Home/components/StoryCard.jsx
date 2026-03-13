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
  // 🔹 Sécurisation globale
  const {
    id,
    title = "Sans titre",
    coverImage,
    cover,
    pages,
    description = "",
    likesCount = 0,
    commentsCount = 0,
    sharesCount = 0,
    viewsCount = 0,
  } = story || {};

  // 🔥 TON IMAGE OFFICIELLE CLOUDINARY
  const PLACEHOLDER =
    "https://res.cloudinary.com/dn9c4ctav/image/upload/v1772147595/1751816044094_fvqghc.png";

  // 🔹 Gestion intelligente et robuste de l’image
  const coverSrc = useMemo(() => {
    const possibleImage =
      coverImage ||
      cover ||
      pages?.find((p) => p?.type === "image")?.src ||
      pages?.[0]?.src;

    if (
      possibleImage &&
      typeof possibleImage === "string" &&
      possibleImage.startsWith("http")
    ) {
      return possibleImage;
    }

    return PLACEHOLDER;
  }, [coverImage, cover, pages]);

  // 🔹 Navigation
  const handleOpen = useCallback(() => {
    if (!story) return;
    setSelectedStory(story);
    setView("reader");
  }, [story, setSelectedStory, setView]);

  // 🔹 Actions sécurisées
  const handleLike = useCallback(
    (e) => {
      e.stopPropagation();
      if (!user?.uid || !id) return;
      likeStory(user.uid, id);
    },
    [user, id]
  );

  const handleComment = useCallback(
    (e) => {
      e.stopPropagation();
      if (!user?.uid || !id) return;
      const text = prompt("Ton commentaire :");
      if (!text) return;
      commentStory(user.uid, id, text);
    },
    [user, id]
  );

  const handleShare = useCallback(
    (e) => {
      e.stopPropagation();
      if (!user?.uid || !id) return;
      shareStory(user.uid, id);
    },
    [user, id]
  );

  return (
    <div
      onClick={handleOpen}
      style={{
        cursor: "pointer",
        border: "1px solid #00fff2",
        borderRadius: "16px",
        background: "#111",
        overflow: "hidden",
        transition: "0.25s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 0 15px #00fff288")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "none")
      }
    >
      {/* Cover */}
      <div>
        <img
          src={coverSrc}
          alt={title}
          style={{
            width: "100%",
            height: "180px",
            objectFit: "cover",
            display: "block",
          }}
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER;
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: "12px" }}>
        <h4
          style={{
            color: "#00fff2",
            margin: "0 0 6px 0",
            fontSize: "16px",
          }}
        >
          {title}
        </h4>

        {description && (
          <p
            style={{
              fontSize: "12px",
              color: "#aaa",
              marginBottom: "8px",
            }}
          >
            {description.length > 90
              ? description.slice(0, 90) + "..."
              : description}
          </p>
        )}

        {/* Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "#ccc",
          }}
        >
          <span>👁 {viewsCount}</span>

          <span onClick={handleLike} style={{ cursor: "pointer" }}>
            ❤️ {likesCount}
          </span>

          <span onClick={handleComment} style={{ cursor: "pointer" }}>
            💬 {commentsCount}
          </span>

          <span onClick={handleShare} style={{ cursor: "pointer" }}>
            🔗 {sharesCount}
          </span>
        </div>
      </div>
    </div>
  );
}