import React from "react";

export default function Recommendation({ setSelectedStory }) {
  const data = [
    { id: 1, title: "Comic A" },
    { id: 2, title: "Comic B" },
    { id: 3, title: "Comic C" },
  ];

  return (
    <div style={{ display: "flex", gap: "15px", overflowX: "auto" }}>
      {data.map((story) => (
        <div
          key={story.id}
          onClick={() => setSelectedStory(story)}
          style={{
            minWidth: "120px",
            minHeight: "160px",
            background: "#222",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
            textAlign: "center",
          }}
        >
          {story.title}
        </div>
      ))}
    </div>
  );
}