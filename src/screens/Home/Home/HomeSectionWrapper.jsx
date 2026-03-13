import React from "react";

export default function HomeSectionWrapper({
  title,
  children,
  actionLabel,
  onActionClick,
}) {
  return (
    <section
      style={{
        marginBottom: "40px",
        padding: "20px",
        borderRadius: "20px",
        background: "linear-gradient(145deg, #0f0f0f, #1a1a1a)",
        border: "1px solid rgba(168, 85, 247, 0.25)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
      }}
    >
      {/* Header Premium */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "18px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: "600",
            background: "linear-gradient(90deg, #a855f7, #00fff2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.5px",
          }}
        >
          {title}
        </h3>

        {actionLabel && (
          <button
            onClick={onActionClick}
            style={{
              background: "transparent",
              border: "1px solid rgba(168, 85, 247, 0.5)",
              color: "#a855f7",
              padding: "6px 14px",
              borderRadius: "999px",
              fontSize: "12px",
              cursor: "pointer",
              transition: "0.2s ease",
            }}
          >
            {actionLabel}
          </button>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          display: "grid",
          gap: "18px",
        }}
      >
        {children}
      </div>
    </section>
  );
}