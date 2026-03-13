import React from "react";
import { publierStory } from "../api/publishStory";

export default function PublishButton() {
  const handleClick = async () => {
    const storyData = {
      title: "Mon premier webtoon",
      description: "Résumé...",
      genre: "Action",
      authorId: "uid_user",
      coverImage: "https://tonlien.com/cover.png",
      pages: [
        { type: "text", text: "Première ligne du chapitre" },
        { type: "image", src: "https://tonlien.com/image1.png" }
      ]
    };

    const result = await publierStory(storyData);
    alert(`Story publiée avec ID : ${result.storyId}`);
  };

  return (
    <button onClick={handleClick} style={{
      padding: "10px 20px",
      backgroundColor: "#00f7ff",
      color: "#000",
      fontWeight: "bold",
      borderRadius: "8px",
      cursor: "pointer",
    }}>
      Publier Story
    </button>
  );
}