import React, { useMemo } from "react";

const DEFAULT_PROFILE =
  "https://res.cloudinary.com/dn9c4ctav/image/upload/v1772147595/1751816044094_fvqghc.png";

export default function TopCreator({
  creators = [],
  setView,
  setSelectedUser,
}) {
  // 🔥 Classement basé sur activité
  const rankedCreators = useMemo(() => {
    return [...creators]
      .sort((a, b) => {
        const scoreA =
          (a.totalLikes || 0) +
          (a.totalViews || 0) +
          (a.storiesCount || 0) * 50;

        const scoreB =
          (b.totalLikes || 0) +
          (b.totalViews || 0) +
          (b.storiesCount || 0) * 50;

        return scoreB - scoreA;
      })
      .slice(0, 10);
  }, [creators]);

  const handleOpenProfile = (creator) => {
    setSelectedUser(creator); // 🔥 important
    setView("profile");
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h3 style={{ color: "#00fff2", marginBottom: "15px" }}>
        🔥 Top Créateurs
      </h3>

      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "18px",
          paddingBottom: "12px",
        }}
      >
        {rankedCreators.map((c, index) => (
          <div
            key={c.id}
            onClick={() => handleOpenProfile(c)}
            style={{
              cursor: "pointer",
              textAlign: "center",
              transition: "0.3s",
            }}
          >
            <div
              style={{
                width: "75px",
                height: "75px",
                borderRadius: "50%",
                overflow: "hidden",
                border:
                  index === 0
                    ? "3px solid gold"
                    : "2px solid #00fff2",
                boxShadow:
                  index === 0
                    ? "0 0 15px gold"
                    : "0 0 10px #00fff266",
                marginBottom: "6px",
                transition: "0.3s",
              }}
            >
              <img
                src={c.photoURL || DEFAULT_PROFILE}
                alt={c.username}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_PROFILE;
                }}
              />
            </div>

            <span
              style={{
                color: "#fff",
                fontSize: "12px",
                fontWeight: index === 0 ? "bold" : "normal",
              }}
            >
              {c.username}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}