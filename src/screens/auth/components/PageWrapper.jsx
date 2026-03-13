import React from "react";
import "./PageWrapper.css";

export default function PageWrapper({ children }) {
  return (
    <div className="safeArea">
      <div className="container">
        {children}
      </div>
    </div>
  );
}