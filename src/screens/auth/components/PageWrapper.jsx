import React from "react";
import "./PageWrapper.css";

export default function PageWrapper({ children, fullScreen = false }) {
  return (
    <div className="comic-wrapper">
      {/* Fond sombre avec une subtile lueur néon en arrière-plan fixe */}
      <div className="cosmic-glow" />

      {/* Zone de contenu fluide */}
      <div className={fullScreen ? "content-fluid full-page" : "content-fluid standard-box"}>
        {children}
      </div>
    </div>
  );
}