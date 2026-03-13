import React, { useState, useEffect } from "react";
import Recommendation from "./Recommendation";
import NewStories from "./NewStories";
import Genres from "./Genres";
import Featured from "./Featured";
import TopCreators from "./TopCreators";
import HomeSectionWrapper from "./HomeSectionWrapper";

export default function Home({ setView, setSelectedStory, toggleBurger }) {
  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "25px" }}>
      
      <HomeSectionWrapper title="Recommandations pour vous">
        <Recommendation setSelectedStory={setSelectedStory} />
      </HomeSectionWrapper>

      <HomeSectionWrapper title="Nouvelles histoires">
        <NewStories setSelectedStory={setSelectedStory} />
      </HomeSectionWrapper>

      <HomeSectionWrapper title="Genres">
        <Genres setView={setView} />
      </HomeSectionWrapper>

      <HomeSectionWrapper title="Sélections du moment">
        <Featured setSelectedStory={setSelectedStory} />
      </HomeSectionWrapper>

      <HomeSectionWrapper title="Top créateurs">
        <TopCreators setView={setView} />
      </HomeSectionWrapper>

    </div>
  );
}