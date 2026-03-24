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
        border: neon ? "1px solid #a855f7" : "1px solid #222",
        boxShadow: neon ? "0 0 15px rgba(168,85,247,0.3)" : "none",
      }}
    >
      <h2
        style={{
          fontSize: 18,
          marginBottom: 10,
          color: neon ? "#00f5d4" : "#fff",
          letterSpacing: 1,
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

function MenuItem({ label, onClick, neon }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "14px 0",
        borderBottom: "1px solid #222",
        cursor: "pointer",
        transition: "0.2s",
        color: neon ? "#00f5d4" : "#fff",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateX(5px)";
        e.currentTarget.style.opacity = "0.8";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateX(0)";
        e.currentTarget.style.opacity = "1";
      }}
    >
      {label}
    </div>
  );
}

/* =========================
   ABOUT SCREEN
========================= */

export default function About({ setView }) {
  const [neon, setNeon] = useState(true);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 20,
        color: "white",
        background: neon
          ? "radial-gradient(circle at center, #0a1128, #000)"
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
              ? "linear-gradient(90deg, #a855f7, #00f5d4)"
              : "none",
            WebkitBackgroundClip: neon ? "text" : "initial",
            WebkitTextFillColor: neon ? "transparent" : "#fff",
          }}
        >
          À propos
        </h1>
      </div>

      <p style={{ color: "#aaa", marginBottom: 20 }}>
        Version 1.1.0
      </p>

      {/* TOGGLE STYLE */}
      <button
        onClick={() => setNeon(!neon)}
        style={{
          marginBottom: 25,
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
          Bienvenue dans le menu À propos de Comicrafte Studio.
          Un grand merci à vous d’utiliser notre application.
        </p>

        <p>
          Nous vous invitons à découvrir un univers unique où lecteurs et auteurs
          se rencontrent pour partager des histoires captivantes, dans un
          environnement pensé pour être fluide, moderne et accessible à tous.
        </p>

        <p>
          Votre présence ici est importante pour nous. Chaque utilisateur
          contribue à faire évoluer la plateforme et à renforcer cette vision
          d’un espace créatif libre et ambitieux.
        </p>
      </Section>

      {/* MISSION */}
      <Section title="Notre mission" neon={neon}>
        <p>
          Comicrafte Studio App a été conçue par les membres du studio
          Comicrafte afin de créer un environnement stable, propre et performant.
        </p>

        <p>
          Notre objectif est d’offrir une expérience riche aux lecteurs et un
          espace de création puissant pour les auteurs, afin de permettre à
          chacun d’exprimer son imagination sans limite.
        </p>

        <p>
          Nous construisons une plateforme durable, où la qualité, la sécurité
          et l’innovation sont au cœur de chaque fonctionnalité.
        </p>
      </Section>

      {/* INFORMATIONS */}
      <Section title="Informations" neon={neon}>
        <MenuItem label="Aide" onClick={() => setView("help")} neon={neon} />
        <MenuItem label="Conditions générales d'utilisation" onClick={() => setView("terms")} neon={neon} />
        <MenuItem label="Politique de confidentialité" onClick={() => setView("privacy")} neon={neon} />
        <MenuItem label="Mentions légales" onClick={() => setView("terms")} neon={neon} />
        <MenuItem label="Open Source License" onClick={() => setView("license")} neon={neon} />
      </Section>

      {/* CONTACT */}
      <Section title="Nous contacter" neon={neon}>
        <MenuItem
          label="Facebook"
          onClick={() =>
            window.open(
              "https://www.facebook.com/profile.php?id=61575000093271",
              "_blank"
            )
          }
          neon={neon}
        />

        <MenuItem
          label="Telegram"
          onClick={() =>
            window.open("https://t.me/+MFbcXPrVJXE2YTNk", "_blank")
          }
          neon={neon}
        />

        <MenuItem
          label="Email"
          onClick={() =>
            window.open("mailto:kenbala441@gmail.com")
          }
          neon={neon}
        />
      </Section>

      {/* MESSAGE FINAL */}
      <Section title="Remerciement" neon={neon}>
        <p>
          Un grand merci à vous d’utiliser cette application.
        </p>

        <p>
          Nous vous invitons à nous soutenir sur nos différents réseaux afin de
          participer à l’évolution du projet. Votre soutien permet d’améliorer
          continuellement l’expérience et d’apporter encore plus de contenu et
          de fonctionnalités.
        </p>

        <p>
          Vous êtes au cœur de cette aventure. Ensemble, nous construisons une
          plateforme unique dédiée à la créativité et au partage.
        </p>
      </Section>
    </div>
  );
}