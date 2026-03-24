import React, { useState } from "react";

/* =========================
   COMPONENTS
========================= */

function Section({ title, children, neon }) {
  return (
    <div
      style={{
        marginBottom: 25,
        padding: 15,
        borderRadius: 12,
        background: neon
          ? "rgba(255,255,255,0.03)"
          : "rgba(255,255,255,0.02)",
        border: neon ? "1px solid #00f5d4" : "1px solid #222",
        boxShadow: neon ? "0 0 15px rgba(0,245,212,0.3)" : "none",
      }}
    >
      <h2
        style={{
          fontSize: 18,
          marginBottom: 10,
          color: neon ? "#00f5d4" : "#fff",
        }}
      >
        {title}
      </h2>

      <div style={{ color: "#ccc", lineHeight: 1.6 }}>
        {children}
      </div>
    </div>
  );
}

function Button({ label, onClick, neon }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "14px",
        marginTop: 10,
        borderRadius: 10,
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        letterSpacing: "1px",
        background: neon
          ? "linear-gradient(90deg, #00f5d4, #00bbf9)"
          : "#222",
        color: "#fff",
        boxShadow: neon ? "0 0 15px rgba(0,245,212,0.4)" : "none",
        transition: "0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {label}
    </button>
  );
}

/* =========================
   HELP SCREEN
========================= */

export default function Help({ setView }) {
  const [neon, setNeon] = useState(true);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 20,
        color: "white",
        background: neon
          ? "radial-gradient(circle at center, #001f2f, #000)"
          : "#050505",
        transition: "0.3s",
      }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={() => setView("home")}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          ←
        </button>

        <h1
          style={{
            background: neon
              ? "linear-gradient(90deg, #00f5d4, #00bbf9)"
              : "none",
            WebkitBackgroundClip: neon ? "text" : "initial",
            WebkitTextFillColor: neon ? "transparent" : "#fff",
          }}
        >
          Centre d'aide
        </h1>
      </div>

      {/* TOGGLE STYLE */}
      <button
        onClick={() => setNeon(!neon)}
        style={{
          margin: "20px 0",
          padding: "8px 15px",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
        }}
      >
        Mode : {neon ? "Néon" : "Normal"}
      </button>

      {/* BIENVENUE */}
      <Section title="Bienvenue" neon={neon}>
        <p>
          Bienvenue dans le menu d’assistance et le centre d’aide du studio
          Comicrafte.
        </p>

        <p>
          Au cours de votre utilisation de notre application, si vous rencontrez
          un problème, remarquez un bug ou souhaitez signaler une erreur à
          corriger, vous êtes exactement au bon endroit.
        </p>

        <p>
          Notre objectif est de vous offrir une assistance rapide, claire et
          efficace afin de garantir une expérience fluide et agréable.
        </p>
      </Section>

      {/* SUPPORT */}
      <Section title="Support utilisateur" neon={neon}>
        <p>
          Notre support est disponible 7j/7 selon votre rôle dans
          l’application (lecteur ou auteur).
        </p>

        <p>
          Pour accéder à l’assistance complète et bénéficier d’un suivi
          personnalisé, veuillez vous connecter à votre compte.
        </p>

        <Button
          label="SE CONNECTER AU SUPPORT"
          onClick={() => setView("login")}
          neon={neon}
        />
      </Section>

      {/* CONTACT */}
      <Section title="Contact rapide" neon={neon}>
        <p>
          En cas d’urgence, vous pouvez contacter directement notre équipe via
          WhatsApp. Ce canal est réservé aux situations importantes nécessitant
          une réponse rapide.
        </p>

        <Button
          label="CONTACT WHATSAPP (NUMÉRO MASQUÉ)"
          onClick={() => alert("Numéro masqué (à configurer)")}
          neon={neon}
        />
      </Section>

      {/* MESSAGE FINAL */}
      <Section title="Assistance continue" neon={neon}>
        <p>
          Nous travaillons constamment à améliorer notre service afin de répondre
          à vos besoins.
        </p>

        <p>
          Chaque message, chaque retour et chaque signalement contribue à rendre
          l’application plus stable, plus performante et plus agréable pour tous.
        </p>

        <p>
          Merci pour votre confiance et votre contribution à l’évolution de
          Comicrafte Studio.
        </p>
      </Section>
    </div>
  );
}